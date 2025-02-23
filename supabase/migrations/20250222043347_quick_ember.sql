/*
  # Fix Profile Creation Process

  1. Changes
    - Simplify profile creation trigger
    - Add better error handling
    - Ensure proper constraints
    - Fix membership_tier handling

  2. Security
    - Use SECURITY DEFINER for proper permissions
    - Maintain existing RLS policies
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function with CASCADE to handle dependencies
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  username_val text;
  full_name_val text;
BEGIN
  -- Get username from metadata or email
  username_val := COALESCE(
    new.raw_user_meta_data->>'username',
    REGEXP_REPLACE(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
  );

  -- Get full name from metadata or username
  full_name_val := COALESCE(
    new.raw_user_meta_data->>'full_name',
    username_val
  );

  -- Simple insert with unique username handling
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    membership_tier,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    CASE 
      WHEN EXISTS (SELECT 1 FROM profiles WHERE username = username_val)
      THEN username_val || '_' || substring(gen_random_uuid()::text from 1 for 6)
      ELSE username_val
    END,
    full_name_val,
    'initiates',
    now(),
    now()
  );

  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure profiles table has correct constraints
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE profiles ALTER COLUMN membership_tier SET NOT NULL DEFAULT 'initiates';
ALTER TABLE profiles ALTER COLUMN created_at SET NOT NULL DEFAULT now();
ALTER TABLE profiles ALTER COLUMN updated_at SET NOT NULL DEFAULT now();

-- Add index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Ensure proper RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update or create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
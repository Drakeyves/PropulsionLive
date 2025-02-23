/*
  # Fix User Signup Process

  1. Changes
    - Improve user profile creation trigger
    - Add better error handling
    - Handle username conflicts
    - Ensure required constraints

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
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      REGEXP_REPLACE(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
    ),
    new.raw_user_meta_data->>'full_name',
    now(),
    now()
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle username conflicts by appending random string
    INSERT INTO public.profiles (
      id,
      username,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      new.id,
      COALESCE(
        new.raw_user_meta_data->>'username',
        REGEXP_REPLACE(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
      ) || '_' || substring(gen_random_uuid()::text from 1 for 8),
      new.raw_user_meta_data->>'full_name',
      now(),
      now()
    );
    RETURN new;
  WHEN others THEN
    RAISE EXCEPTION 'Error creating profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure profiles table has correct constraints
DO $$ 
BEGIN
  -- Add NOT NULL constraints if they don't exist
  ALTER TABLE profiles 
    ALTER COLUMN username SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;
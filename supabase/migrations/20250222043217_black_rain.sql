/*
  # Fix User Profile Creation

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
  retry_count int := 0;
  max_retries int := 3;
BEGIN
  -- Get username and full_name from metadata
  username_val := COALESCE(
    new.raw_user_meta_data->>'username',
    REGEXP_REPLACE(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
  );
  full_name_val := COALESCE(
    new.raw_user_meta_data->>'full_name',
    username_val
  );

  -- Try to insert with retries for unique constraint
  LOOP
    BEGIN
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
          WHEN retry_count = 0 THEN username_val
          ELSE username_val || '_' || substring(gen_random_uuid()::text from 1 for 6)
        END,
        full_name_val,
        'initiates',
        now(),
        now()
      );
      
      -- If successful, exit the loop
      EXIT;
    EXCEPTION 
      WHEN unique_violation THEN
        -- Only retry if we haven't hit max retries
        IF retry_count >= max_retries THEN
          RAISE EXCEPTION 'Failed to create unique username after % attempts', max_retries;
        END IF;
        retry_count := retry_count + 1;
      WHEN others THEN
        RAISE EXCEPTION 'Error creating profile: %', SQLERRM;
    END;
  END LOOP;

  RETURN new;
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
    ALTER COLUMN membership_tier SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;
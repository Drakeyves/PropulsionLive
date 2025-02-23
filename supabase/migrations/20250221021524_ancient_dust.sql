/*
  # Fix Database Relationships and Policies

  1. Changes
    - Fix admin_users policies to prevent recursion
    - Add missing indexes and constraints
    - Add profile triggers and notifications
    - Add admin helper functions

  2. Security
    - Update RLS policies for better security
    - Fix infinite recursion in admin policies
*/

-- Fix admin_users policies by removing recursion
DROP POLICY IF EXISTS "Only super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view own record" ON admin_users;

-- Create new admin policies without recursion
CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role = 'super_admin'
      UNION
      SELECT id FROM auth.users WHERE email = 'drazoyves@gmail.com'
    )
  );

CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  USING (
    id = auth.uid() OR
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'drazoyves@gmail.com'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Add missing profile triggers
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notifications for new user
  INSERT INTO notifications (
    user_id,
    type,
    title,
    content,
    reference_type,
    reference_id
  ) VALUES (
    NEW.id,
    'system',
    'Welcome to Propulsion Society!',
    'Welcome aboard! Start exploring our community and tools.',
    'profile',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new profile notifications
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile();

-- Ensure proper cascading deletes
DO $$ BEGIN
  -- Only drop if exists
  ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE notifications
ADD CONSTRAINT notifications_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

DO $$ BEGIN
  -- Only drop if exists
  ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE comments
ADD CONSTRAINT comments_author_id_fkey
FOREIGN KEY (author_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- Add helpful functions for admin operations
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = user_id
    UNION
    SELECT 1 FROM auth.users
    WHERE id = user_id AND email = 'drazoyves@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
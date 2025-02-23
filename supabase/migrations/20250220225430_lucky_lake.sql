/*
  # Thread System Implementation

  1. New Tables
    - `threads` - Main thread table
      - `id` (uuid, primary key)
      - `title` (text)
      - `pinned` (boolean)
      - `author_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `last_activity_at` (timestamptz)
      - `views_count` (integer)
      - `replies_count` (integer)
      - `status` (text)
      - `category` (text)
      - `metadata` (jsonb)

    - `thread_posts` - Posts within threads
      - `id` (uuid, primary key)
      - `thread_id` (uuid, references threads)
      - `author_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `edited_at` (timestamptz)
      - `status` (text)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for thread and post access

  3. Functions
    - Add triggers for updating thread statistics
    - Add function for pinning/unpinning threads
*/

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  pinned boolean DEFAULT false,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  views_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'archived')),
  category text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create thread_posts table
CREATE TABLE IF NOT EXISTS thread_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  status text NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'flagged')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_threads_pinned ON threads (pinned) WHERE pinned = true;
CREATE INDEX IF NOT EXISTS idx_threads_last_activity ON threads (last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_thread_posts_thread_id ON thread_posts (thread_id);

-- Create policies for threads
CREATE POLICY "Anyone can view active threads"
  ON threads
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can create threads"
  ON threads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Thread authors can update their threads"
  ON threads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Create policies for thread posts
CREATE POLICY "Anyone can view visible thread posts"
  ON thread_posts
  FOR SELECT
  USING (status = 'visible');

CREATE POLICY "Authenticated users can create thread posts"
  ON thread_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Post authors can update their posts"
  ON thread_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Create function to update thread statistics
CREATE OR REPLACE FUNCTION update_thread_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE threads
    SET 
      replies_count = replies_count + 1,
      last_activity_at = now()
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE threads
    SET 
      replies_count = replies_count - 1,
      last_activity_at = (
        SELECT COALESCE(MAX(created_at), threads.created_at)
        FROM thread_posts
        WHERE thread_id = OLD.thread_id
      )
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for thread statistics
CREATE TRIGGER update_thread_stats
  AFTER INSERT OR DELETE ON thread_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_statistics();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_thread_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE threads
  SET views_count = views_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for view count
CREATE TRIGGER increment_views
  AFTER INSERT ON threads
  FOR EACH ROW
  EXECUTE FUNCTION increment_thread_views();

-- Function to safely create welcome thread
CREATE OR REPLACE FUNCTION create_welcome_thread()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
  welcome_thread_id uuid;
BEGIN
  -- Get the first admin user (or any user if no admin exists)
  SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Create welcome thread
    INSERT INTO threads (
      title,
      pinned,
      author_id,
      category,
      status
    ) VALUES (
      'Welcome to The Propulsion Society! 🚀',
      true,
      admin_user_id,
      'Announcements',
      'active'
    ) RETURNING id INTO welcome_thread_id;

    -- Create welcome post
    IF welcome_thread_id IS NOT NULL THEN
      INSERT INTO thread_posts (
        thread_id,
        author_id,
        content
      ) VALUES (
        welcome_thread_id,
        admin_user_id,
        '## Welcome to The Propulsion Society! 🚀

As your administrators, we''re excited to have you join our community dedicated to all things propulsion engineering and technology. Here''s what you can expect:

📚 Share and discuss propulsion innovations
🔧 Technical discussions and problem-solving
👥 Network with fellow propulsion enthusiasts
📢 Latest industry news and developments
💡 Project collaborations and ideas

Please introduce yourself and share your interests in propulsion technology. Feel free to start discussions or ask questions about any propulsion-related topics.

Remember to follow our community guidelines:
- Be respectful and professional
- Share knowledge constructively
- Credit sources when applicable
- Keep discussions on-topic

Welcome aboard! Let''s advance propulsion technology together.

-The Propulsion Society Admin Team'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the welcome thread creation
SELECT create_welcome_thread();

-- Clean up the function as it's no longer needed
DROP FUNCTION create_welcome_thread();
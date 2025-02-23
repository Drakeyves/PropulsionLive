/*
  # Community Hub Schema Setup

  1. New Tables
    - `posts`
      - User-generated content with rich text support
      - Categories and tags
      - Reactions and engagement metrics
    - `comments`
      - Nested comment structure
      - Reactions and moderation status
    - `events`
      - Community events with registration
      - Virtual and physical event support
    - `resources`
      - Shared documents and links
      - Access control and categories
    - `notifications`
      - User notifications for activity
      - Multiple notification types

  2. Security
    - RLS policies for all tables
    - User-based access control
    - Content moderation flags

  3. Changes
    - Added functions for engagement metrics
    - Added triggers for notification generation
*/

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  parent_id uuid REFERENCES comments(id),
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'flagged')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('virtual', 'physical', 'hybrid')),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  timezone text NOT NULL,
  location jsonb,
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  resource_type text NOT NULL CHECK (resource_type IN ('document', 'link', 'video', 'other')),
  url text NOT NULL,
  category text NOT NULL,
  access_level text NOT NULL DEFAULT 'public' CHECK (access_level IN ('public', 'members', 'premium')),
  downloads_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('post_like', 'comment', 'mention', 'event', 'system')),
  title text NOT NULL,
  content text NOT NULL,
  reference_type text NOT NULL,
  reference_id uuid NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can view published posts"
  ON posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can view visible comments"
  ON comments
  FOR SELECT
  USING (status = 'visible');

CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Events policies
CREATE POLICY "Anyone can view upcoming and ongoing events"
  ON events
  FOR SELECT
  USING (status IN ('upcoming', 'ongoing'));

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Event registrations policies
CREATE POLICY "Users can view own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Resources policies
CREATE POLICY "Users can view appropriate resources"
  ON resources
  FOR SELECT
  USING (
    access_level = 'public' OR
    (access_level = 'members' AND auth.role() = 'authenticated') OR
    (access_level = 'premium' AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND membership_tier = 'premium'
    ))
  );

CREATE POLICY "Users can create resources"
  ON resources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET comments_count = comments_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    content,
    reference_type,
    reference_id
  )
  SELECT
    p.author_id,
    'comment',
    'New comment on your post',
    substring(NEW.content from 1 for 100),
    'post',
    p.id
  FROM posts p
  WHERE p.id = NEW.post_id AND p.author_id != NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER increment_post_comment_count
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_comment_count();

CREATE TRIGGER notify_post_comment
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION create_comment_notification();
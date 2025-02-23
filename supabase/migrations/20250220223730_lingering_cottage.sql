/*
  # Enhanced Posts System

  1. New Features
    - Draft support
    - Scheduled posts
    - Media attachments
    - Rich text content
    - Post categories and tags

  2. Changes
    - Added media_attachments column for file uploads
    - Added scheduled_for column for post scheduling
    - Added last_edited_at for autosave tracking
    - Added metadata for rich text state
*/

-- Add new columns to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS media_attachments jsonb[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS scheduled_for timestamptz,
ADD COLUMN IF NOT EXISTS last_edited_at timestamptz,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create function to validate media attachments
CREATE OR REPLACE FUNCTION validate_media_attachments()
RETURNS TRIGGER AS $$
BEGIN
  -- Check file size (10MB limit)
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(NEW.media_attachments) AS attachment
    WHERE (attachment->>'size')::bigint > 10485760
  ) THEN
    RAISE EXCEPTION 'File size exceeds 10MB limit';
  END IF;

  -- Check file types
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(NEW.media_attachments) AS attachment
    WHERE attachment->>'type' NOT IN ('image/jpeg', 'image/png', 'image/gif', 'video/mp4')
  ) THEN
    RAISE EXCEPTION 'Invalid file type';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for media validation
CREATE TRIGGER validate_post_media
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION validate_media_attachments();

-- Update post status type
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_status_check,
ADD CONSTRAINT posts_status_check 
CHECK (status IN ('draft', 'published', 'scheduled', 'archived'));

-- Create index for scheduled posts
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for
ON posts (scheduled_for)
WHERE status = 'scheduled';

-- Create function to publish scheduled posts
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET status = 'published'
  WHERE status = 'scheduled'
    AND scheduled_for <= now();
END;
$$ LANGUAGE plpgsql;
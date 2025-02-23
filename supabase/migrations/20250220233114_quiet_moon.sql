/*
  # Admin System Setup

  1. New Tables
    - `admin_users`: Stores admin user information and permissions
    - `admin_audit_logs`: Tracks admin actions for security
    - `admin_settings`: Stores system-wide settings

  2. Security
    - Enable RLS on all tables
    - Add policies for admin-only access
    - Create audit logging triggers
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Only super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Create policies for admin_audit_logs
CREATE POLICY "Only admins can view audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Create policies for admin_settings
CREATE POLICY "Only admins can manage settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid()
    )
  );

-- Create function to handle admin audit logging
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    entity_type,
    entity_id,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN jsonb_build_object('new', row_to_json(NEW)::jsonb)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', row_to_json(OLD)::jsonb, 'new', row_to_json(NEW)::jsonb)
      WHEN TG_OP = 'DELETE' THEN jsonb_build_object('old', row_to_json(OLD)::jsonb)
    END,
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_events_trigger
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

CREATE TRIGGER audit_resources_trigger
  AFTER INSERT OR UPDATE OR DELETE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- Insert initial admin user
INSERT INTO admin_users (id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'drazoyves@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Insert initial settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('site_name', '"Propulsion Society"', 'Website name'),
  ('maintenance_mode', 'false', 'Site maintenance mode'),
  ('allowed_file_types', '["image/jpeg", "image/png", "image/gif", "application/pdf"]', 'Allowed file upload types'),
  ('max_file_size', '10485760', 'Maximum file upload size in bytes');
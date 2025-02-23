/*
  # Create analytics tables

  1. New Tables
    - `analytics`
      - `id` (uuid, primary key)
      - `active_users` (integer)
      - `previous_active_users` (integer)
      - `revenue` (numeric)
      - `previous_revenue` (numeric)
      - `conversion_rate` (numeric)
      - `previous_conversion_rate` (numeric)
      - `engagement` (numeric)
      - `previous_engagement` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `alerts`
      - `id` (uuid, primary key)
      - `type` (text)
      - `message` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  active_users integer NOT NULL DEFAULT 0,
  previous_active_users integer NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  previous_revenue numeric NOT NULL DEFAULT 0,
  conversion_rate numeric NOT NULL DEFAULT 0,
  previous_conversion_rate numeric NOT NULL DEFAULT 0,
  engagement numeric NOT NULL DEFAULT 0,
  previous_engagement numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('warning', 'error', 'success')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Authenticated users can read analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update analytics"
  ON analytics
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for alerts
CREATE POLICY "Authenticated users can read alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics updated_at
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert initial analytics data
INSERT INTO analytics (
  active_users, previous_active_users,
  revenue, previous_revenue,
  conversion_rate, previous_conversion_rate,
  engagement, previous_engagement
) VALUES (
  100, 80,
  5000, 4500,
  2.5, 2.1,
  15, 12
);

-- Insert sample alerts
INSERT INTO alerts (type, message) VALUES
  ('success', 'New user milestone reached: 1000+ active users'),
  ('warning', 'Conversion rate dropped below target'),
  ('error', 'Payment processing system needs attention');
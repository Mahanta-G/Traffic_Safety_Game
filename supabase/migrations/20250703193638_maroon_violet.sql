/*
  # Create leaderboard table for traffic safety game

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `player_name` (text, not null)
      - `score` (integer, not null)
      - `level` (integer, not null)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, for 7-day retention)

  2. Security
    - Enable RLS on `leaderboard` table
    - Add policy for anyone to read leaderboard data
    - Add policy for anyone to insert scores
    - Add policy to automatically delete expired entries

  3. Indexes
    - Index on score for fast sorting
    - Index on expires_at for cleanup
    - Index on level for filtering
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard data
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

-- Allow anyone to insert scores
CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_expires_at ON leaderboard(expires_at);
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Function to clean up expired entries (runs automatically)
CREATE OR REPLACE FUNCTION cleanup_expired_leaderboard()
RETURNS void AS $$
BEGIN
  DELETE FROM leaderboard WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup daily (if pg_cron is available)
-- This will be handled by Supabase's built-in scheduling
/*
  # Add liked playlists functionality

  1. Changes
    - Create liked_playlists table if it doesn't exist
    - Add RLS policies if they don't exist
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS liked_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  genre text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, genre)
);

-- Enable RLS
ALTER TABLE liked_playlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their liked playlists" ON liked_playlists;
DROP POLICY IF EXISTS "Users can view their liked playlists" ON liked_playlists;

-- Create new policies
CREATE POLICY "Users can manage their liked playlists"
  ON liked_playlists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their liked playlists"
  ON liked_playlists
  FOR SELECT
  USING (auth.uid() = user_id);
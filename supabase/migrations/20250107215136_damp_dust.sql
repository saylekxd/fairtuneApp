/*
  # Add likes functionality

  1. New Tables
    - `liked_tracks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `track_id` (uuid, references tracks)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `liked_tracks` table
    - Add policies for users to manage their likes
*/

CREATE TABLE IF NOT EXISTS liked_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_id)
);

ALTER TABLE liked_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their likes"
  ON liked_tracks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their likes"
  ON liked_tracks
  FOR SELECT
  USING (auth.uid() = user_id);
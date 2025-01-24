/*
  # Add Genre Playlists

  1. New Tables
    - `genre_playlists`
      - `id` (uuid, primary key)
      - `genre` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `genre_playlists` table
    - Add policy for authenticated users to read genre playlists
*/

CREATE TABLE IF NOT EXISTS genre_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  genre text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE genre_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view genre playlists"
  ON genre_playlists FOR SELECT
  TO authenticated
  USING (true);

-- Insert default genre playlists
INSERT INTO genre_playlists (genre) VALUES
  ('Pop'),
  ('Rock'),
  ('Hip Hop'),
  ('R&B'),
  ('Jazz'),
  ('Classical'),
  ('Electronic'),
  ('Country'),
  ('Folk'),
  ('Blues'),
  ('Reggae'),
  ('Metal'),
  ('Latin'),
  ('World');
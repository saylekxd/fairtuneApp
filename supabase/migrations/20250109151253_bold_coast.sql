/*
  # Artist Management System

  1. New Tables
    - `artists`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `bio` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
  2. Changes
    - Add `artist_id` to tracks table
    
  3. Security
    - Enable RLS on artists table
    - Add policies for authenticated users
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  bio text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add artist_id to tracks
ALTER TABLE tracks
ADD COLUMN IF NOT EXISTS artist_id uuid REFERENCES artists(id);

-- Create index for artist name search
CREATE INDEX IF NOT EXISTS idx_artists_name_search ON artists USING GIN (name gin_trgm_ops);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to artists"
  ON artists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to manage artists"
  ON artists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND role = 'admin'
    )
  );

-- Update trigger for updated_at
CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
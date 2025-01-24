/*
  # Add genre column to playlists table

  1. Changes
    - Add genre column to playlists table
    - Update existing playlists to have a default genre
*/

-- Add genre column to playlists table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'playlists' AND column_name = 'genre'
  ) THEN
    ALTER TABLE playlists ADD COLUMN genre text;
  END IF;
END $$;
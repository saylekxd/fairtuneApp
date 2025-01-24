/*
  # Add Default Location and Update Schema
  
  1. Changes
    - Add default location for new users
    - Make location_id optional in playlists table
*/

-- Create a default location if it doesn't exist
INSERT INTO locations (id, name, description)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Default Location',
  'Default location for new users'
) ON CONFLICT (id) DO NOTHING;

-- Make location_id nullable in playlists table
ALTER TABLE playlists 
ALTER COLUMN location_id DROP NOT NULL;
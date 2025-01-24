/*
  # Reset Music Management System
  
  1. Data Cleanup
    - Safely removes all existing music-related data
    - Preserves user accounts and system structure
    - Resets genre playlists to default state
    
  2. Changes
    - Uses DELETE instead of TRUNCATE for safer operation
    - Maintains referential integrity
    - Preserves system triggers and permissions
*/

-- Delete data from tables in correct order to maintain referential integrity
DELETE FROM playlist_tracks;
DELETE FROM playlist_schedules;
DELETE FROM liked_tracks;
DELETE FROM liked_playlists;
DELETE FROM playlists;
DELETE FROM tracks;

-- Reset genre playlists
DELETE FROM genre_playlists;

-- Re-insert default genre playlists
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

-- Clean up storage objects
DELETE FROM storage.objects 
WHERE bucket_id = 'music' 
AND name LIKE 'public/%';
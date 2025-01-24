/*
  # Add Track Management Policies

  1. Changes
    - Add RLS policies for tracks table to allow admin users to manage tracks
    - Allow all authenticated users to view tracks
  
  2. Security
    - Only admins can insert, update, and delete tracks
    - All authenticated users can view tracks
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "allow_read_tracks" ON tracks;
DROP POLICY IF EXISTS "allow_admin_manage_tracks" ON tracks;

-- Allow all authenticated users to view tracks
CREATE POLICY "allow_read_tracks"
  ON tracks FOR SELECT
  TO authenticated
  USING (true);

-- Allow admins to manage tracks
CREATE POLICY "allow_admin_manage_tracks"
  ON tracks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND role = 'admin'
    )
  );
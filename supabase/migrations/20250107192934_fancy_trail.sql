/*
  # Fix User and Playlist Policies

  1. Changes
    - Remove recursive user policies
    - Add simplified playlist access control
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view profiles in their location" ON users;
DROP POLICY IF EXISTS "view_own_profile" ON users;
DROP POLICY IF EXISTS "view_all_users" ON users;
DROP POLICY IF EXISTS "update_own_profile" ON users;
DROP POLICY IF EXISTS "Users can view playlists in their location" ON playlists;
DROP POLICY IF EXISTS "Managers and admins can manage playlists" ON playlists;

-- Create simplified user policies
CREATE POLICY "allow_read_own_user"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "allow_update_own_user"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Create simplified playlist policies
CREATE POLICY "allow_read_playlists"
  ON playlists FOR SELECT
  USING (true);

CREATE POLICY "allow_insert_playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "allow_delete_own_playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = created_by);
-- Drop existing policies
DROP POLICY IF EXISTS "allow_read_tracks" ON tracks;
DROP POLICY IF EXISTS "allow_admin_manage_tracks" ON tracks;

-- Allow all authenticated users to view tracks
CREATE POLICY "allow_read_tracks"
  ON tracks FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert tracks
CREATE POLICY "allow_insert_tracks"
  ON tracks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update and delete their own tracks (based on who uploaded them)
CREATE POLICY "allow_manage_own_tracks"
  ON tracks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlist_tracks pt
      JOIN playlists p ON pt.playlist_id = p.id
      WHERE pt.track_id = tracks.id
      AND p.created_by = auth.uid()
    )
  );
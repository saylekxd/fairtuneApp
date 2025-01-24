-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_read_tracks" ON tracks;
DROP POLICY IF EXISTS "allow_insert_tracks" ON tracks;
DROP POLICY IF EXISTS "allow_manage_own_tracks" ON tracks;

-- Create a simple read policy for authenticated users
CREATE POLICY "allow_read_tracks"
  ON tracks FOR SELECT
  USING (true);

-- Create insert policy for authenticated users
CREATE POLICY "allow_insert_tracks"
  ON tracks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create update/delete policy for admin users
CREATE POLICY "allow_manage_tracks"
  ON tracks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND role = 'admin'
    )
  );
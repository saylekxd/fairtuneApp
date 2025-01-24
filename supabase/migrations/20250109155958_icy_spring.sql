-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Allow admins to manage content blocks" ON content_blocks;

-- Create policies
CREATE POLICY "Allow public read access to content blocks"
  ON content_blocks FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Allow admins to manage content blocks"
  ON content_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND role = 'admin'
    )
  );
-- Create liked playlists table
CREATE TABLE IF NOT EXISTS liked_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  genre text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, genre)
);

ALTER TABLE liked_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their liked playlists"
  ON liked_playlists
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their liked playlists"
  ON liked_playlists
  FOR SELECT
  USING (auth.uid() = user_id);
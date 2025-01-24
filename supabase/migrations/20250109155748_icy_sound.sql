-- First make genre column unique in genre_playlists
ALTER TABLE genre_playlists
ADD CONSTRAINT genre_playlists_genre_key UNIQUE (genre);

-- Create content blocks table
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('playlist', 'news')),
  size text NOT NULL CHECK (size IN ('large', 'medium', 'small')),
  genre text REFERENCES genre_playlists(genre) ON DELETE SET NULL,
  link_url text,
  position integer NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

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

-- Create updated_at trigger
CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert some initial content blocks
INSERT INTO content_blocks (title, description, image_url, type, size, genre, position) VALUES
('Hip-Hop Mix', 'Latest hip-hop tracks', 'https://images.unsplash.com/photo-1571609803939-54f463c5ce1c?auto=format&fit=crop&w=800&q=80', 'playlist', 'large', 'Hip Hop', 1),
('Rock Essentials', 'Classic rock hits', 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80', 'playlist', 'medium', 'Rock', 2),
('Pop Hits', 'Top pop tracks', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'playlist', 'medium', 'Pop', 3),
('Artist Spotlight', 'Discover emerging talent', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80', 'news', 'small', null, 4);
/*
  # Hip-Hop Music Visualization System

  1. New Tables
    - `discovery_playlists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `genre_playlists`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `genre` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create discovery playlists table
CREATE TABLE IF NOT EXISTS discovery_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create genre playlists table
CREATE TABLE IF NOT EXISTS hip_hop_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  subgenre text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_subgenre CHECK (subgenre IN ('Trap', 'Boom Bap', 'Old School', 'Modern', 'Underground', 'Instrumental'))
);

-- Create junction tables
CREATE TABLE IF NOT EXISTS discovery_playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES discovery_playlists(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (playlist_id, track_id)
);

CREATE TABLE IF NOT EXISTS hip_hop_playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES hip_hop_playlists(id) ON DELETE CASCADE,
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (playlist_id, track_id)
);

-- Enable RLS
ALTER TABLE discovery_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE hip_hop_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hip_hop_playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to discovery playlists"
  ON discovery_playlists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to hip-hop playlists"
  ON hip_hop_playlists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to discovery playlist tracks"
  ON discovery_playlist_tracks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to hip-hop playlist tracks"
  ON hip_hop_playlist_tracks FOR SELECT
  TO authenticated
  USING (true);

-- Create admin policies
CREATE POLICY "Allow admins to manage discovery playlists"
  ON discovery_playlists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Allow admins to manage hip-hop playlists"
  ON hip_hop_playlists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND role = 'admin'
    )
  );
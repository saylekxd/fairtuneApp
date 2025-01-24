/*
  # Add storage policies for music files

  1. Storage Setup
    - Create bucket for music files
    - Add policies for authenticated users
*/

-- Enable storage if not already enabled
INSERT INTO storage.buckets (id, name, public) 
VALUES ('music', 'music', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload music files
CREATE POLICY "Users can upload music files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND
  (storage.extension(name) = 'mp3' OR storage.extension(name) = 'wav')
);

-- Allow authenticated users to read their uploaded music
CREATE POLICY "Users can read music files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'music');
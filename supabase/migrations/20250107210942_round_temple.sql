-- Update storage bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'music';

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload music files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read music files" ON storage.objects;

-- Create new policies for public access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'music' AND position('public/' in name) = 1);

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'music' AND
  position('public/' in name) = 1
);
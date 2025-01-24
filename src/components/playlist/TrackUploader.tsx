import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Track } from '../../types';

export const TrackUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Upload to Supabase Storage
      const filename = `${crypto.randomUUID()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('music')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(filename);

      // Create track record
      const { error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          artist: 'Unknown Artist', // You might want to add an input for this
          duration: 0, // You might want to calculate this
          url: publicUrl,
          is_explicit: false
        });

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block w-full">
        <input
          type="file"
          accept="audio/mp3,audio/wav"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            {uploading ? 'Uploading...' : 'Upload Track'}
          </span>
        </div>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
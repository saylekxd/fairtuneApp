import React, { useState, useRef } from 'react';
import { Upload, X, Image, Music, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminTrackUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    coverUrl: '',
    duration: 0
  });

  const genres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'R&B',
    'Jazz',
    'Classical',
    'Electronic',
    'Country',
    'Folk',
    'Blues',
    'Reggae',
    'Metal',
    'Latin',
    'World'
  ];

  const calculateAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration));
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    const duration = await calculateAudioDuration(file);
    setFormData(prev => ({ ...prev, duration }));
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);

    const filename = `public/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError, data } = await supabase.storage
      .from('music')
      .upload(filename, file);

    if (uploadError) {
      setError('Failed to upload cover image');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('music')
      .getPublicUrl(filename);

    setFormData(prev => ({ ...prev, coverUrl: publicUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select an audio file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      const file = fileInputRef.current.files[0];
      const filename = `public/${crypto.randomUUID()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('music')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(filename);

      const { error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: formData.artist,
          genre: formData.genre,
          duration: formData.duration || 0,
          url: publicUrl,
          cover_url: formData.coverUrl,
          is_explicit: false
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      setSuccess(true);
      setSelectedFileName(null);
      window.dispatchEvent(new CustomEvent('track-uploaded'));

      // Reset form
      setFormData({
        title: '',
        artist: '',
        genre: '',
        coverUrl: '',
        duration: 0
      });
      setCoverPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/mp3,audio/wav"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-zinc-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Music className="w-6 h-6" />
              )}
              <span className="font-medium">
                {selectedFileName || 'Select audio file'}
              </span>
            </div>
          </label>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block w-full">
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={handleCoverSelect}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-32 h-32 object-cover rounded" />
              ) : (
                <>
                  <Image className="w-6 h-6" />
                  <span className="font-medium">Select cover image</span>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Track Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Artist
            </label>
            <input
              type="text"
              value={formData.artist}
              onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Genre
            </label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 text-green-500 p-3 rounded-lg text-sm">
            Track uploaded successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </span>
          ) : (
            'Upload Track'
          )}
        </button>
      </form>
    </div>
  );
};
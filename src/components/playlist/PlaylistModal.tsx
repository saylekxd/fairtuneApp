import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: {
    id: string;
    name: string;
    description: string | null;
    shuffle_enabled: boolean;
  };
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, playlist }) => {
  const [name, setName] = useState(playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [shuffleEnabled, setShuffleEnabled] = useState(playlist?.shuffle_enabled || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure user profile exists
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!userProfile) {
        // Wait for user profile creation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (playlist) {
        const { error: updateError } = await supabase
          .from('playlists')
          .update({
            name,
            description,
            shuffle_enabled: shuffleEnabled,
            updated_at: new Date().toISOString(),
          })
          .eq('id', playlist.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('playlists')
          .insert({
            name,
            description,
            shuffle_enabled: shuffleEnabled,
            created_by: user.id,
            location_id: '00000000-0000-0000-0000-000000000000'
          });
          
        if (insertError) throw insertError;
      }
      onClose();
    } catch (err) {
      console.error('Error saving playlist:', err);
      setError('Failed to save playlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {playlist ? 'Edit Playlist' : 'Create Playlist'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="shuffle"
              checked={shuffleEnabled}
              onChange={(e) => setShuffleEnabled(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="shuffle" className="text-sm text-zinc-400">
              Enable shuffle mode
            </label>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Playlist'}
          </button>
        </form>
      </div>
    </div>
  );
};
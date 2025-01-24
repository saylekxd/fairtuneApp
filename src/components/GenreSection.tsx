import React, { memo, useCallback } from 'react';
import { Play, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import type { Track } from '../types';

const GENRE_COVERS = {
  'Pop': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&w=400&q=75',
  'Rock': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&w=400&q=75',
  'Hip Hop': 'https://images.unsplash.com/photo-1571609803939-54f463c5ce1c?auto=format&w=400&q=75'
} as const;

interface GenreSectionProps {
  genre: string;
  tracks: Track[];
  likedTracks: Set<string>;
  onLikeToggle?: (trackId: string, liked: boolean) => void;
}

export const GenreSection = memo(({ genre, tracks, likedTracks, onLikeToggle }: GenreSectionProps) => {
  const { setCurrentTrack } = useStore();

  const handleLikeToggle = useCallback(async (trackId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isLiked = likedTracks.has(trackId);
      
      if (isLiked) {
        const { error: deleteError } = await supabase
          .from('liked_tracks')
          .delete()
          .eq('track_id', trackId)
          .eq('user_id', user.id);

        if (!deleteError) {
          onLikeToggle?.(trackId, false);
        }
      } else {
        const { error: insertError } = await supabase
          .from('liked_tracks')
          .insert({
            track_id: trackId,
            user_id: user.id
          });

        if (!insertError) {
          onLikeToggle?.(trackId, true);
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [likedTracks, onLikeToggle]);

  if (tracks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{genre}</h3>
        <button className="text-sm text-zinc-400 hover:text-white">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="group relative"
          >
            <div className="aspect-square mb-2">
              <img
                src={track.cover_url || GENRE_COVERS[genre as keyof typeof GENRE_COVERS]}
                alt={track.title}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => setCurrentTrack(track)}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-full transform scale-95 hover:scale-100 transition-transform"
                >
                  <Play className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            <h4 className="font-medium truncate">{track.title}</h4>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
            <button
              onClick={() => handleLikeToggle(track.id)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
              aria-label={likedTracks.has(track.id) ? 'Unlike track' : 'Like track'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  likedTracks.has(track.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-white'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

GenreSection.displayName = 'GenreSection';
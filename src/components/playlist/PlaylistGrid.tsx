import React, { useState, useEffect, memo, useCallback } from 'react';
import { Play, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { OptimizedImage } from '../ui/OptimizedImage';
import type { Track } from '../../types';

const TrackItem = memo(({ 
  track, 
  onPlay, 
  isLiked, 
  onLikeToggle 
}: { 
  track: Track;
  onPlay: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
}) => (
  <div className="group relative">
    <div className="aspect-square mb-2">
      <OptimizedImage
        src={track.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=300&q=75'}
        alt={track.title}
        className="w-full h-full object-cover rounded-lg bg-zinc-800"
        width={300}
        height={300}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <button
          onClick={onPlay}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full transform scale-95 hover:scale-100 transition-transform"
        >
          <Play className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
    <h4 className="font-medium truncate">{track.title}</h4>
    <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
    <button
      onClick={onLikeToggle}
      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
      aria-label={isLiked ? 'Unlike track' : 'Like track'}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isLiked ? 'text-red-500 fill-red-500' : 'text-white'
        }`}
      />
    </button>
  </div>
));

interface PlaylistGridProps {
  showLikedOnly?: boolean;
}

export const PlaylistGrid = memo(({ showLikedOnly = false }: PlaylistGridProps) => {
  const { playTrack } = useStore();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTracks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let tracksQuery = supabase.from('tracks').select('*');

        if (showLikedOnly) {
          const { data: likedData } = await supabase
            .from('liked_tracks')
            .select('track_id')
            .eq('user_id', user.id);

          if (likedData && likedData.length > 0) {
            const likedIds = likedData.map(like => like.track_id);
            tracksQuery = tracksQuery.in('id', likedIds);
          } else {
            if (isMounted) {
              setTracks([]);
              setLoading(false);
            }
            return;
          }
        }

        const [{ data: tracksData }, { data: likesData }] = await Promise.all([
          tracksQuery.order('created_at', { ascending: false }),
          supabase
            .from('liked_tracks')
            .select('track_id')
            .eq('user_id', user.id)
        ]);

        if (isMounted) {
          if (tracksData) {
            setTracks(tracksData);
          }
          if (likesData) {
            setLikedTracks(new Set(likesData.map(like => like.track_id)));
          }
        }
      } catch (err) {
        console.error('Error loading tracks:', err);
        if (isMounted) {
          setError('Failed to load tracks. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTracks();
    return () => { isMounted = false; };
  }, [showLikedOnly]);

  const toggleLike = useCallback(async (trackId: string) => {
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
          setLikedTracks(prev => {
            const next = new Set(prev);
            next.delete(trackId);
            return next;
          });

          if (showLikedOnly) {
            setTracks(prev => prev.filter(t => t.id !== trackId));
          }
        }
      } else {
        const { error: insertError } = await supabase
          .from('liked_tracks')
          .insert({
            track_id: trackId,
            user_id: user.id
          });

        if (!insertError) {
          setLikedTracks(prev => new Set([...prev, trackId]));
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  }, [likedTracks, showLikedOnly]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-zinc-800 rounded-lg mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-4">
          {showLikedOnly 
            ? "You haven't liked any tracks yet."
            : "No tracks available."}
        </p>
        {showLikedOnly && (
          <p className="text-sm text-zinc-500">
            Start exploring the Discover page to find and like tracks!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          onPlay={() => playTrack(track)}
          isLiked={likedTracks.has(track.id)}
          onLikeToggle={() => toggleLike(track.id)}
        />
      ))}
    </div>
  );
});

PlaylistGrid.displayName = 'PlaylistGrid';
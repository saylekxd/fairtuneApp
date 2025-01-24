import React, { useState, useEffect, memo } from 'react';
import { Play, Heart, Music, ListMusic, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import type { Track } from '../../types';

const GENRE_COVERS = {
  'Pop': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&w=500&q=75',
  'Rock': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&w=500&q=75',
  'Hip Hop': 'https://images.unsplash.com/photo-1571609803939-54f463c5ce1c?auto=format&w=500&q=75',
  'R&B': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&w=500&q=75',
  'Jazz': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&w=500&q=75',
  'Classical': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&w=500&q=75',
  'Electronic': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=500&q=75',
  'default': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&w=500&q=75'
} as const;

const TrackList = memo(({ 
  tracks, 
  genre,
  onBack 
}: { 
  tracks: Track[];
  genre: string;
  onBack: () => void;
}) => {
  const { playTrack } = useStore();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadLikedTracks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('liked_tracks')
        .select('track_id')
        .eq('user_id', user.id);

      if (data) {
        setLikedTracks(new Set(data.map(like => like.track_id)));
      }
    };

    loadLikedTracks();
  }, []);

  const toggleTrackLike = async (trackId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isLiked = likedTracks.has(trackId);

      if (isLiked) {
        await supabase
          .from('liked_tracks')
          .delete()
          .eq('track_id', trackId)
          .eq('user_id', user.id);

        setLikedTracks(prev => {
          const next = new Set(prev);
          next.delete(trackId);
          return next;
        });
      } else {
        await supabase
          .from('liked_tracks')
          .insert({
            track_id: trackId,
            user_id: user.id
          });

        setLikedTracks(prev => new Set([...prev, trackId]));
      }
    } catch (err) {
      console.error('Error toggling track like:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold">{genre} Playlist</h2>
      </div>

      <div className="space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={track.cover_url || GENRE_COVERS[genre as keyof typeof GENRE_COVERS] || GENRE_COVERS.default}
                alt={track.title}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
              <button
                onClick={() => playTrack(track)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{track.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
            </div>
            <button
              onClick={() => toggleTrackLike(track.id)}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${likedTracks.has(track.id) ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const GenreCard = memo(({ 
  genre,
  isLiked,
  onLikeToggle,
  onClick
}: { 
  genre: string;
  isLiked: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
  onClick: () => void;
}) => (
  <div className="group relative bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-900/80 transition-colors">
    <div 
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="aspect-square mb-4 relative rounded-lg overflow-hidden">
        <img
          src={GENRE_COVERS[genre as keyof typeof GENRE_COVERS] || GENRE_COVERS.default}
          alt={genre}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 flex items-center justify-center bg-blue-500 rounded-full transform scale-90 hover:scale-100 transition-all shadow-lg">
            <Play className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-lg truncate mb-1">{genre}</h3>
          <p className="text-sm text-zinc-400 truncate">Genre Playlist</p>
        </div>
      </div>
    </div>
    <button
      onClick={onLikeToggle}
      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition-colors z-10"
      aria-label={isLiked ? 'Unlike playlist' : 'Like playlist'}
    >
      <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-zinc-400'}`} />
    </button>
  </div>
));

export const LikedPlaylists = () => {
  const [likedGenres, setLikedGenres] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLikedGenres = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: likedData } = await supabase
          .from('liked_playlists')
          .select('genre')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (likedData && isMounted) {
          setLikedGenres(new Set(likedData.map(like => like.genre)));
        }
      } catch (err) {
        console.error('Error loading liked playlists:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLikedGenres();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;

    const loadTracks = async () => {
      setLoadingTracks(true);
      try {
        const { data } = await supabase
          .from('tracks')
          .select('*')
          .eq('genre', selectedGenre)
          .order('created_at', { ascending: false });

        if (data) {
          setTracks(data);
        }
      } catch (err) {
        console.error('Error loading tracks:', err);
      } finally {
        setLoadingTracks(false);
      }
    };

    loadTracks();
  }, [selectedGenre]);

  const toggleLike = async (genre: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isLiked = likedGenres.has(genre);

      if (isLiked) {
        await supabase
          .from('liked_playlists')
          .delete()
          .eq('user_id', user.id)
          .eq('genre', genre);

        setLikedGenres(prev => {
          const next = new Set(prev);
          next.delete(genre);
          return next;
        });
      } else {
        await supabase
          .from('liked_playlists')
          .insert({
            user_id: user.id,
            genre
          });

        setLikedGenres(prev => new Set([...prev, genre]));
      }
    } catch (err) {
      console.error('Error toggling playlist like:', err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-zinc-800 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (selectedGenre) {
    if (loadingTracks) {
      return (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3">
              <div className="w-12 h-12 bg-zinc-800 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <TrackList
        tracks={tracks}
        genre={selectedGenre}
        onBack={() => setSelectedGenre(null)}
      />
    );
  }

  if (likedGenres.size === 0) {
    return (
      <div className="text-center py-12">
        <ListMusic className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Liked Playlists</h3>
        <p className="text-zinc-400">
          Start exploring genres and like playlists to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from(likedGenres).map((genre) => (
        <GenreCard
          key={genre}
          genre={genre}
          isLiked={true}
          onLikeToggle={(e) => toggleLike(genre, e)}
          onClick={() => setSelectedGenre(genre)}
        />
      ))}
    </div>
  );
};
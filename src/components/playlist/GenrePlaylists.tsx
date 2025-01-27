import React, { useState, useEffect, memo, useCallback } from 'react';
import { Play, Heart, ListMusic, Music2, Construction } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import type { Track } from '../../types';
import { motion } from 'framer-motion';

const GENRE_COVERS = {
  'Pop': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/POP.jpeg',
  'Rock': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/ROC.jpeg?t=2025-01-23T19%3A03%3A39.141Z',
  'Hip Hop': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/HIp-ho.jpeg',
  'R&B': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/RandB.jpeg?t=2025-01-23T19%3A04%3A06.281Z',
  'Jazz': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Jaz.jpeg?t=2025-01-23T19%3A04%3A12.686Z',
  'Classical': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Classica.jpeg',
  'Electronic': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Electroni.jpeg',
  'Country': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Countr.jpeg',
  'Folk': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/FOLK.jpeg',
  'Blues': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/blues.jpeg?t=2025-01-23T19%3A22%3A15.357Z',
  'Reggae': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/regga.jpeg',
  'Metal': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Meta.jpeg?t=2025-01-23T19%3A13%3A06.489Z',
  'Latin': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/latino.jpeg',
  'World': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/WORLD1.jpeg'
} as const;

const GenreCard = memo(({ 
  genre, 
  coverUrl, 
  onSelect,
  isLiked,
  onLikeToggle
}: { 
  genre: string;
  coverUrl: string;
  onSelect: () => void;
  isLiked: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
}) => (
  <div className="group relative aspect-square overflow-hidden rounded-lg">
    <img
      src={coverUrl}
      alt={genre}
      className="w-full h-full object-cover transition-transform group-hover:scale-105"
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <button
        onClick={onLikeToggle}
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
      </button>
      <button
        onClick={onSelect}
        className="absolute inset-0 flex items-end p-4"
      >
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5" />
          <span className="font-medium">{genre}</span>
        </div>
      </button>
    </div>
  </div>
));

export const GenrePlaylists = () => {
  const { playTrack } = useStore();
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedGenres, setLikedGenres] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [{ data: genresData }, { data: likedData }] = await Promise.all([
          supabase
            .from('genre_playlists')
            .select('genre')
            .order('genre'),
          supabase
            .from('liked_playlists')
            .select('genre')
        ]);
        
        if (isMounted) {
          if (genresData) {
            setGenres(genresData.map(g => g.genre));
          }
          if (likedData) {
            setLikedGenres(new Set(likedData.map(like => like.genre)));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading genres:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTracks = async () => {
      if (!selectedGenre) return;

      try {
        const { data } = await supabase
          .from('tracks')
          .select('*')
          .eq('genre', selectedGenre)
          .order('created_at', { ascending: false });
        
        if (data && isMounted) {
          setTracks(data);
          if (data.length > 0) {
            playTrack(data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading tracks:', error);
      }
    };

    loadTracks();
    return () => { isMounted = false; };
  }, [selectedGenre, playTrack]);

  const toggleLike = async (genre: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isLiked = likedGenres.has(genre);

      // Optimistically update UI
      setLikedGenres(prev => {
        const next = new Set(prev);
        if (isLiked) {
          next.delete(genre);
        } else {
          next.add(genre);
        }
        return next;
      });

      if (isLiked) {
        await supabase
          .from('liked_playlists')
          .delete()
          .eq('user_id', user.id)
          .eq('genre', genre);
      } else {
        await supabase
          .from('liked_playlists')
          .insert({
            user_id: user.id,
            genre
          });
      }
    } catch (err) {
      console.error('Error toggling genre like:', err);
      // Revert UI on error
      setLikedGenres(prev => {
        const next = new Set(prev);
        if (likedGenres.has(genre)) {
          next.add(genre);
        } else {
          next.delete(genre);
        }
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedGenre) {
    if (tracks.length === 0) {
      return (
        <div className="p-8">
          <button
            onClick={() => setSelectedGenre(null)}
            className="mb-6 text-zinc-400 hover:text-white flex items-center gap-2"
          >
            ← Back to Genres
          </button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-12"
          >
            <div className="bg-zinc-800/50 rounded-xl p-8 backdrop-blur-sm border border-zinc-700/50">
              <div className="w-16 h-16 mx-auto mb-6 bg-zinc-700/50 rounded-xl flex items-center justify-center">
                <Construction className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Coming Soon!</h3>
              <p className="text-zinc-400 mb-6">
                We're working hard to bring you amazing {selectedGenre} tracks. 
                Check back soon for fresh music in this genre!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-700/50 rounded-full text-sm text-zinc-300">
                <Music2 className="w-4 h-4" />
                <span>New tracks being added daily</span>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="p-8">
        <button
          onClick={() => setSelectedGenre(null)}
          className="mb-6 text-zinc-400 hover:text-white flex items-center gap-2"
        >
          ← Back to Genres
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-zinc-900/50 p-4 rounded-lg group hover:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <img
                    src={track.cover_url || GENRE_COVERS[selectedGenre as keyof typeof GENRE_COVERS] || GENRE_COVERS['Pop']}
                    alt={track.title}
                    className="w-full h-full object-cover rounded"
                    loading="lazy"
                    decoding="async"
                  />
                  <button
                    onClick={() => playTrack(track)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm text-zinc-400">{track.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Ogólne playlisty</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <GenreCard
            key={genre}
            genre={genre}
            coverUrl={GENRE_COVERS[genre as keyof typeof GENRE_COVERS] || GENRE_COVERS['Pop']}
            onSelect={() => setSelectedGenre(genre)}
            isLiked={likedGenres.has(genre)}
            onLikeToggle={(e) => toggleLike(genre, e)}
          />
        ))}
      </div>
    </div>
  );
};
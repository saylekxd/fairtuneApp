import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Heart, Shuffle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { Track } from '../types';

interface PlaylistDetails {
  id: string;
  name: string;
  genre: string;
  image_url: string;
  tracks: Track[];
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function PlaylistDetailsPage() {
  const { genre } = useParams<{ genre: string }>();
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useStore();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const { data: tracks } = await supabase
          .from('tracks')
          .select('*')
          .eq('genre', genre)
          .order('title');

        if (tracks) {
          // Shuffle tracks by default for main playlists
          const shuffledTracks = shuffleArray(tracks);
          
          setPlaylist({
            id: genre || 'unknown',
            name: `${genre} Mix`,
            genre: genre || 'Unknown',
            image_url: `https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Electroni.jpeg`,
            tracks: shuffledTracks
          });
          setIsShuffled(true);
        }

        // Load liked tracks
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: likes } = await supabase
            .from('liked_tracks')
            .select('track_id')
            .eq('user_id', user.id);

          if (likes) {
            setLikedTracks(new Set(likes.map(like => like.track_id)));
          }
        }
      } catch (error) {
        console.error('Error loading playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [genre]);

  const toggleShuffle = () => {
    if (!playlist) return;
    
    const newTracks = isShuffled 
      ? [...playlist.tracks].sort((a, b) => a.title.localeCompare(b.title))
      : shuffleArray(playlist.tracks);
    
    setPlaylist({
      ...playlist,
      tracks: newTracks
    });
    setIsShuffled(!isShuffled);
  };

  const toggleLike = async (trackId: string) => {
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

  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const handlePlayTrack = (track: Track, index: number) => {
    if (playlist) {
      // Create a new playlist starting from the selected track
      const reorderedTracks = [
        ...playlist.tracks.slice(index),
        ...playlist.tracks.slice(0, index)
      ];
      playTrack(track, reorderedTracks);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="track" count={10} />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
        <p className="text-zinc-400">The playlist you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-start gap-8 mb-8">
        <div className="w-48 h-48 rounded-lg overflow-hidden">
          <img
            src={playlist.image_url}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-zinc-400 mb-6">{playlist.tracks.length} tracks</p>
          <div className="flex gap-4">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Play All</span>
            </button>
            <button
              onClick={toggleShuffle}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isShuffled 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <Shuffle className="w-5 h-5" />
              <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {playlist.tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 group transition-colors"
          >
            <div className="w-8 text-center text-sm text-zinc-400">
              {index + 1}
            </div>
            <button
              onClick={() => handlePlayTrack(track, index)}
              className="w-10 h-10 flex items-center justify-center group-hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{track.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
            </div>
            <button
              onClick={() => toggleLike(track.id)}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${
                likedTracks.has(track.id) ? 'text-red-500 fill-red-500' : 'text-zinc-400'
              }`} />
            </button>
            <div className="w-16 text-right text-sm text-zinc-400">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
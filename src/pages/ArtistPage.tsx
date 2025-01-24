import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { Track } from '../types';

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  image_url: string | null;
}

export default function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useStore();

  useEffect(() => {
    const loadArtist = async () => {
      if (!artistId) return;

      try {
        const [artistResponse, tracksResponse] = await Promise.all([
          supabase
            .from('artists')
            .select('*')
            .eq('id', artistId)
            .single(),
          supabase
            .from('tracks')
            .select('*')
            .eq('artist_id', artistId)
            .order('title')
        ]);

        if (artistResponse.data) {
          setArtist(artistResponse.data);
        }
        if (tracksResponse.data) {
          setTracks(tracksResponse.data);
        }
      } catch (error) {
        console.error('Error loading artist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtist();
  }, [artistId]);

  const handlePlayTrack = (track: Track, index: number) => {
    // Create a playlist only from this artist's tracks
    const artistPlaylist = [...tracks];
    // Reorder the playlist to start from the selected track
    const reorderedPlaylist = [
      ...artistPlaylist.slice(index),
      ...artistPlaylist.slice(0, index)
    ];
    playTrack(track, reorderedPlaylist);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      // Pass the complete artist track list as the playlist
      playTrack(tracks[0], tracks);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="track" count={10} />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Artist not found</h2>
          <p className="text-zinc-400">The artist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-start gap-8 mb-8">
        <div className="w-48 h-48 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
          {artist.image_url ? (
            <img
              src={artist.image_url}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-12 h-12 text-zinc-600" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
          {artist.bio && (
            <p className="text-zinc-400 max-w-2xl">{artist.bio}</p>
          )}
          <div className="mt-6">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Play All</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 group transition-colors"
          >
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
            <div className="text-sm text-zinc-400">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
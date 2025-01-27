import React, { useState, useEffect } from 'react';
import { Play, Heart, ListMusic } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { Track } from '../types';

interface PlaylistData {
  id: string;
  name: string;
  image_url: string;
  tracks: Track[];
  subgenre?: string;
}

const HIP_HOP_COVER = 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/HIp-ho.jpeg';

const PlaylistCard = ({ playlist, onPlay }: { playlist: PlaylistData; onPlay: (tracks: Track[]) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(playlist.tracks)}
    >
      <div className="aspect-square overflow-hidden rounded-xl">
        <img 
          src={playlist.image_url} 
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-16 h-16 flex items-center justify-center bg-blue-500 rounded-full transform scale-90 hover:scale-100 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(playlist.tracks);
              }}
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4">
            <h3 className="text-xl font-bold mb-1">{playlist.name}</h3>
            {playlist.subgenre && (
              <p className="text-sm text-zinc-300">{playlist.subgenre}</p>
            )}
            <p className="text-sm text-zinc-400">{playlist.tracks.length} utworów</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HipHopPage() {
  const [discoveryPlaylists, setDiscoveryPlaylists] = useState<PlaylistData[]>([]);
  const [genrePlaylists, setGenrePlaylists] = useState<PlaylistData[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useStore();

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const [discoveryResponse, genreResponse] = await Promise.all([
          supabase
            .from('discovery_playlists')
            .select(`
              *,
              tracks:discovery_playlist_tracks(
                track:tracks(*)
              )
            `)
            .order('created_at', { ascending: false }),
          supabase
            .from('hip_hop_playlists')
            .select(`
              *,
              tracks:hip_hop_playlist_tracks(
                track:tracks(*)
              )
            `)
            .order('created_at', { ascending: false })
        ]);

        if (discoveryResponse.data) {
          setDiscoveryPlaylists(discoveryResponse.data.map(playlist => ({
            ...playlist,
            tracks: playlist.tracks.map((t: any) => t.track)
          })));
        }

        if (genreResponse.data) {
          setGenrePlaylists(genreResponse.data.map(playlist => ({
            ...playlist,
            tracks: playlist.tracks.map((t: any) => t.track)
          })));
        }
      } catch (error) {
        console.error('Błąd podczas ładowania playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  const handlePlayPlaylist = (tracks: Track[]) => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="genre" count={8} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="relative h-[300px] -mx-8 -mt-8 mb-12">
        <img
          src={HIP_HOP_COVER}
          alt="Hip-Hop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="absolute bottom-0 inset-x-0 p-8">
            <h1 className="text-5xl font-bold mb-4">Hip-Hop</h1>
            <p className="text-xl text-zinc-300">Odkryj najlepszą muzykę hip-hopową</p>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Playlisty odkrywcze</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
            <ListMusic className="w-5 h-5" />
            <span>Zobacz wszystkie</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {discoveryPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Playlisty gatunkowe</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
            <ListMusic className="w-5 h-5" />
            <span>Zobacz wszystkie</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {genrePlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
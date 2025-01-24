import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, ListMusic } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { DiscoverBanner } from '../components/DiscoverBanner';
import type { Track } from '../types';

interface PlaylistData {
  genre: string;
  tracks: Track[];
  coverUrl: string;
  size: 'large' | 'medium' | 'small';
}

const GENRE_COVERS = {
  'Pop': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/POP.jpeg',
  'Rock': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/ROC.jpeg?t=2025-01-23T19%3A03%3A39.141Z',
  'Hip Hop': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/HIp-ho.jpeg',
  'R&B': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/RandB.jpeg?t=2025-01-23T19%3A04%3A06.281Z',
  'Jazz': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Jaz.jpeg?t=2025-01-23T19%3A04%3A12.686Z',
  'Classical': 'https://qzepctajlohvguilkgbn.supabase.co/storage/v1/object/public/music/photos/coverAlbumsPhotos/Classica.jpeg'
} as const;

function DiscoverPage() {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useStore();

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const { data: tracks } = await supabase
          .from('tracks')
          .select('*')
          .order('created_at', { ascending: false });

        if (tracks) {
          // Group tracks by genre
          const groupedTracks = tracks.reduce((acc, track) => {
            if (track.genre && track.genre in GENRE_COVERS) {
              if (!acc[track.genre]) {
                acc[track.genre] = [];
              }
              acc[track.genre].push(track);
            }
            return acc;
          }, {} as Record<string, Track[]>);

          // Create playlist data with different sizes
          const playlistData: PlaylistData[] = Object.entries(groupedTracks).map(([genre, tracks], index) => ({
            genre,
            tracks,
            coverUrl: GENRE_COVERS[genre as keyof typeof GENRE_COVERS],
            size: index === 0 ? 'large' : index < 3 ? 'medium' : 'small'
          }));

          setPlaylists(playlistData);
        }
      } catch (error) {
        console.error('Error loading playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  const handlePlayPlaylist = (tracks: Track[]) => {
    if (tracks.length > 0) {
      // Pass both the first track and the complete playlist
      playTrack(tracks[0], tracks);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Discover</h2>
        <div className="grid grid-cols-4 gap-4">
          <LoadingSkeleton type="genre" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DiscoverBanner />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Discover</h2>
          <p className="text-zinc-400">Explore curated playlists for every mood</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
          <ListMusic className="w-5 h-5" />
          <span>View All</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 auto-rows-[240px]">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.genre}
            playlist={playlist}
            onPlay={handlePlayPlaylist}
          />
        ))}
      </div>
    </div>
  );
}

const PlaylistCard = ({ 
  playlist, 
  onPlay 
}: { 
  playlist: PlaylistData; 
  onPlay: (tracks: Track[]) => void;
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pass only the tracks from this playlist
    onPlay(playlist.tracks);
  };

  const sizeClasses = {
    large: 'col-span-2 row-span-2',
    medium: 'col-span-2 row-span-1',
    small: 'col-span-1 row-span-1'
  };

  return (
    <div 
      className={`relative group cursor-pointer ${sizeClasses[playlist.size]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/playlist/${playlist.genre}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <img 
        src={playlist.coverUrl} 
        alt={playlist.genre}
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{playlist.genre}</span>
          </div>
          <button
            onClick={handleLikeClick}
            className={`p-2 rounded-full transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } ${isLiked ? 'bg-white/20' : 'bg-black/20 hover:bg-black/40'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>
        <div className={`transition-all ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">{playlist.genre} Mix</h3>
              <p className="text-sm text-zinc-300">{playlist.tracks.length} tracks</p>
            </div>
            <button 
              className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
              onClick={handlePlayClick}
            >
              <Play className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
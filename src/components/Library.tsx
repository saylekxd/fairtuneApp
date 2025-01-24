import React, { useState, useEffect } from 'react';
import { PlayCircle, Plus, Clock, Shuffle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { PlaylistModal } from './playlist/PlaylistModal';
import { PlaylistScheduleModal } from './playlist/PlaylistScheduleModal';
import type { Playlist } from '../types';

export const Library = () => {
  const { setCurrentTrack } = useStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setPlaylists(data);
    }
  };

  const handleScheduleClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsScheduleModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-zinc-400 text-sm font-medium">YOUR LIBRARY</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {playlists.map(playlist => (
          <div key={playlist.id} className="bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{playlist.name}</h3>
              <div className="flex items-center gap-2">
                {playlist.shuffle_enabled && (
                  <Shuffle className="w-4 h-4 text-blue-400" />
                )}
                <button
                  onClick={() => handleScheduleClick(playlist)}
                  className="p-1 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
            {playlist.description && (
              <p className="text-sm text-zinc-400 mb-3">{playlist.description}</p>
            )}
          </div>
        ))}
      </div>

      <PlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          loadPlaylists();
        }}
      />

      {selectedPlaylist && (
        <PlaylistScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSelectedPlaylist(null);
          }}
          playlistId={selectedPlaylist.id}
        />
      )}
    </div>
  );
};
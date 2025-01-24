import React, { useState } from 'react';
import { Music, ListMusic } from 'lucide-react';
import { PlaylistGrid } from '../components/playlist/PlaylistGrid';
import { LikedPlaylists } from '../components/playlist/LikedPlaylists';

const TabButton = ({ active, children, onClick }: { 
  active: boolean; 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-zinc-800 text-white' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
    }`}
  >
    {children}
  </button>
);

export default function MyMusicPage() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">My Music</h2>
        <div className="flex items-center gap-2">
          <TabButton
            active={activeTab === 'tracks'}
            onClick={() => setActiveTab('tracks')}
          >
            <Music className="w-5 h-5" />
            <span>Liked Tracks</span>
          </TabButton>
          <TabButton
            active={activeTab === 'playlists'}
            onClick={() => setActiveTab('playlists')}
          >
            <ListMusic className="w-5 h-5" />
            <span>Liked Playlists</span>
          </TabButton>
        </div>
      </div>

      {activeTab === 'tracks' ? (
        <PlaylistGrid showLikedOnly={true} />
      ) : (
        <LikedPlaylists />
      )}
    </div>
  );
}
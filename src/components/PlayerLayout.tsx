import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu, Lock, Crown } from 'lucide-react';
import { Player } from './Player';
import { VoiceMessagePanel } from './VoiceMessagePanel';
import { UserMenu } from './UserMenu';
import { Navigation } from './Navigation';
import { SubscriptionBanner } from './SubscriptionBanner';
import { useStore } from '../store/useStore';
import { useAdminStatus } from '../hooks/useAdminStatus';

// Lazy load pages for better performance
const DiscoverPage = React.lazy(() => import('../pages/DiscoverPage'));
const PlaylistDetailsPage = React.lazy(() => import('../pages/PlaylistDetailsPage'));
const PlaylistsPage = React.lazy(() => import('../pages/PlaylistsPage'));
const MyMusicPage = React.lazy(() => import('../pages/MyMusicPage'));
const UploadPage = React.lazy(() => import('../pages/UploadPage'));
const PreferencesPage = React.lazy(() => import('../pages/PreferencesPage'));
const ArtistsPage = React.lazy(() => import('../pages/ArtistsPage'));
const ArtistPage = React.lazy(() => import('../pages/ArtistPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const LockedFeatureOverlay = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-zinc-900/80 backdrop-blur-sm">
    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
      <Lock className="w-8 h-8 text-zinc-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">Wkrótce dostępne</h3>
    <p className="text-zinc-400 mb-4">
      Moduł audiobrandingu opartego o AI będzie dostępny w przyszłej wersji.
    </p>
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800">
      <Crown className="w-4 h-4 text-yellow-500" />
      <span className="text-sm text-zinc-300">Komponent VoiceAI</span>
    </div>
  </div>
);

export default function PlayerLayout() {
  const { showBanner, initAudio, loadRandomTracks, queue } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAdmin } = useAdminStatus();

  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return;

      try {
        initAudio();
        if (queue.length === 0) {
          await loadRandomTracks();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initialize();
  }, [initAudio, loadRandomTracks, queue.length, isInitialized]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-900 to-black text-white">
      {showBanner && <SubscriptionBanner />}
      <div className="flex-1 flex overflow-hidden">
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800/90 backdrop-blur-sm rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/95 backdrop-blur-sm transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:bg-transparent md:backdrop-blur-none
          ${navOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-4">
            <div className="mb-6">
              <UserMenu />
            </div>
            <Navigation onItemClick={() => setNavOpen(false)} />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<DiscoverPage />} />
                <Route path="/playlist/:genre" element={<PlaylistDetailsPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/my-music" element={<MyMusicPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/preferences" element={<PreferencesPage />} />
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/artists/:artistId" element={<ArtistPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>

          <div className="hidden lg:block w-[400px] border-l border-white/10">
            <div className="h-full relative">
              {isAdmin ? (
                <div className="h-full p-6">
                  <h2 className="text-xl font-bold mb-6">Voice Messages</h2>
                  <div className="h-[calc(100%-3rem)]">
                    <VoiceMessagePanel />
                  </div>
                </div>
              ) : (
                <LockedFeatureOverlay />
              )}
            </div>
          </div>
        </div>

        {navOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}
      </div>
      <Player />
    </div>
  );
}
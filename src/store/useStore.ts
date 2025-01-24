import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { audioCache } from '../lib/audioCache';
import { playlistPreloader } from '../lib/playlistPreloader';
import type { Track, VoiceMessage } from '../types';

interface Store {
  messages: VoiceMessage[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  showBanner: boolean;
  audioElement: HTMLAudioElement | null;
  progress: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  isLoading: boolean;
  currentGenre: string | null;
  preloadProgress: number;
  isPreloading: boolean;

  addVoiceMessage: (message: Omit<VoiceMessage, 'id'>) => void;
  deleteMessage: (id: string) => void;
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track, playlist?: Track[]) => Promise<void>;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  dismissBanner: () => void;
  initAudio: () => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  loadPlaylistTracks: (genre: string) => Promise<void>;
  loadRandomTracks: () => Promise<void>;
  setPreloadProgress: (progress: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      messages: [],
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      showBanner: true,
      audioElement: null,
      progress: 0,
      duration: 0,
      queue: [],
      queueIndex: -1,
      isLoading: false,
      currentGenre: null,
      preloadProgress: 0,
      isPreloading: false,

      addVoiceMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
            },
          ],
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),

      setCurrentTrack: (track) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.pause();
          audioElement.src = track.url;
          audioElement.load();
          set({ currentTrack: track, isPlaying: false });
        }
      },

      playTrack: async (track, playlist) => {
        const { audioElement, queue, isLoading } = get();
        if (!audioElement || isLoading) return;

        try {
          set({ isLoading: true });

          // Update queue if playlist is provided
          if (playlist) {
            set({ queue: playlist });
          }

          // Stop current track
          audioElement.pause();
          
          // Try to get cached audio data
          const audioData = await playlistPreloader.preloadTrack(track);
          
          if (audioData) {
            // Create blob URL from cached data
            const blob = new Blob([audioData], { type: 'audio/mpeg' });
            audioElement.src = URL.createObjectURL(blob);
          } else {
            // Verify audio file exists before setting source
            try {
              const response = await fetch(track.url, { method: 'HEAD' });
              if (!response.ok) {
                throw new Error(`Audio file not found: ${track.url}`);
              }
              audioElement.src = track.url;
            } catch (error) {
              console.error('Error loading audio:', error);
              // Skip to next track if available
              const trackIndex = get().queue.findIndex(t => t.id === track.id);
              if (trackIndex < get().queue.length - 1) {
                const nextTrack = get().queue[trackIndex + 1];
                set({ isLoading: false });
                await get().playTrack(nextTrack, get().queue);
                return;
              }
              throw new Error('Unable to play track: Audio file not found');
            }
          }
          
          audioElement.load();
          
          // Find track index in queue
          const trackIndex = get().queue.findIndex(t => t.id === track.id);
          
          // Update state
          set({ 
            currentTrack: track, 
            queueIndex: trackIndex !== -1 ? trackIndex : 0,
            currentGenre: track.genre || null,
            isPlaying: false
          });

          // Wait for metadata and play
          await new Promise((resolve, reject) => {
            const handleLoaded = () => {
              audioElement.removeEventListener('loadedmetadata', handleLoaded);
              resolve(null);
            };
            const handleError = (e: Event) => {
              audioElement.removeEventListener('error', handleError);
              reject(new Error('Failed to load audio'));
            };
            audioElement.addEventListener('loadedmetadata', handleLoaded);
            audioElement.addEventListener('error', handleError);
          });

          await audioElement.play();
          set({ isPlaying: true });

          // Start preloading next track if in playlist
          if (playlist && trackIndex < playlist.length - 1) {
            playlistPreloader.preloadTrack(playlist[trackIndex + 1]);
          }
        } catch (error) {
          console.error('Playback error:', error);
          set({ isPlaying: false });
          
          // Try to play next track if available
          const currentIndex = get().queueIndex;
          if (currentIndex < get().queue.length - 1) {
            const nextTrack = get().queue[currentIndex + 1];
            set({ isLoading: false });
            await get().playTrack(nextTrack, get().queue);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      togglePlay: async () => {
        const { isPlaying, audioElement, currentTrack, isLoading } = get();
        if (!audioElement || !currentTrack || isLoading) return;

        try {
          set({ isLoading: true });
          
          if (isPlaying) {
            audioElement.pause();
            set({ isPlaying: false });
          } else {
            await audioElement.play();
            set({ isPlaying: true });
          }
        } catch (error) {
          console.error('Toggle play error:', error);
          set({ isPlaying: false });
        } finally {
          set({ isLoading: false });
        }
      },

      setVolume: (volume) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.volume = volume;
        }
        set({ volume });
      },

      setProgress: (progress) => {
        const { audioElement } = get();
        if (audioElement) {
          audioElement.currentTime = progress;
        }
        set({ progress });
      },

      dismissBanner: () => set({ showBanner: false }),

      initAudio: () => {
        const { audioElement } = get();
        if (!audioElement) {
          const audio = new Audio();
          
          audio.addEventListener('timeupdate', () => {
            set({ progress: audio.currentTime });
          });

          audio.addEventListener('loadedmetadata', () => {
            set({ duration: audio.duration });
          });

          audio.addEventListener('ended', () => {
            set({ isPlaying: false });
            get().playNext();
          });

          audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            set({ isPlaying: false, isLoading: false });
          });

          audio.addEventListener('waiting', () => {
            set({ isLoading: true });
          });

          audio.addEventListener('playing', () => {
            set({ isLoading: false });
          });

          set({ audioElement: audio });
        }
      },

      playNext: async () => {
        const { queue, queueIndex, currentGenre, isLoading } = get();
        if (isLoading) return;

        if (queueIndex < queue.length - 1) {
          const nextTrack = queue[queueIndex + 1];
          await get().playTrack(nextTrack);
          return;
        }

        try {
          const { data: tracks } = await supabase
            .from('tracks')
            .select('*')
            .neq('genre', currentGenre)
            .limit(10)
            .order('created_at', { ascending: false });

          if (tracks && tracks.length > 0) {
            const shuffledTracks = tracks.sort(() => Math.random() - 0.5);
            set({
              queue: shuffledTracks,
              queueIndex: -1,
              currentGenre: null
            });
            await get().playTrack(shuffledTracks[0]);
          }
        } catch (error) {
          console.error('Error loading next tracks:', error);
        }
      },

      playPrevious: async () => {
        const { queue, queueIndex, isLoading } = get();
        if (isLoading || queueIndex <= 0) return;

        const prevTrack = queue[queueIndex - 1];
        await get().playTrack(prevTrack);
      },

      loadPlaylistTracks: async (genre: string) => {
        try {
          set({ isPreloading: true });
          
          const { data: tracks } = await supabase
            .from('tracks')
            .select('*')
            .eq('genre', genre)
            .order('created_at', { ascending: false });
          
          if (tracks) {
            set({
              queue: tracks,
              currentGenre: genre
            });

            // Start preloading the playlist
            playlistPreloader.preloadPlaylist(tracks, (progress) => {
              set({ preloadProgress: progress });
            });
          }
        } catch (error) {
          console.error('Error loading playlist tracks:', error);
        } finally {
          set({ isPreloading: false });
        }
      },

      loadRandomTracks: async () => {
        try {
          const { data: tracks } = await supabase
            .from('tracks')
            .select('*')
            .limit(10)
            .order('created_at', { ascending: false });
          
          if (tracks) {
            const shuffledTracks = tracks.sort(() => Math.random() - 0.5);
            set({
              queue: shuffledTracks,
              currentGenre: null
            });
          }
        } catch (error) {
          console.error('Error loading random tracks:', error);
        }
      },

      setPreloadProgress: (progress) => set({ preloadProgress: progress })
    }),
    {
      name: 'adna-storage',
      partialize: (state) => ({
        showBanner: state.showBanner,
        volume: state.volume
      }),
    }
  )
);
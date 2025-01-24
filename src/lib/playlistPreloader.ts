import { Track } from '../types';
import { audioCache } from './audioCache';

export class PlaylistPreloader {
  private preloadQueue: Track[] = [];
  private isPreloading = false;
  private abortController: AbortController | null = null;

  async preloadPlaylist(tracks: Track[], onProgress?: (progress: number) => void) {
    // Cancel any ongoing preloading
    this.abortController?.abort();
    this.abortController = new AbortController();

    this.preloadQueue = [...tracks];
    this.isPreloading = true;

    let loaded = 0;
    const total = tracks.length;

    try {
      for (const track of tracks) {
        if (!this.isPreloading) break;

        try {
          // Check if track is already cached
          const cached = await audioCache.getCachedTrack(track.id);
          if (!cached) {
            // Fetch and cache the track
            const response = await fetch(track.url, {
              signal: this.abortController.signal
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const buffer = await response.arrayBuffer();
            await audioCache.cacheTrack(track, buffer);
          }

          loaded++;
          onProgress?.(Math.round((loaded / total) * 100));
        } catch (error) {
          console.warn(`Failed to preload track ${track.id}:`, error);
          // Continue with next track instead of breaking the entire preload
          continue;
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Preloading cancelled');
      } else {
        console.error('Error preloading tracks:', error);
      }
    } finally {
      this.isPreloading = false;
      this.abortController = null;
    }
  }

  stopPreloading() {
    this.isPreloading = false;
    this.abortController?.abort();
    this.preloadQueue = [];
  }

  async preloadTrack(track: Track): Promise<ArrayBuffer | null> {
    try {
      if (!track?.url) {
        console.warn('Invalid track or missing URL');
        return null;
      }

      // Check cache first
      const cached = await audioCache.getCachedTrack(track.id);
      if (cached) return cached;

      // Fetch and cache if not found
      const response = await fetch(track.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      await audioCache.cacheTrack(track, buffer);
      return buffer;
    } catch (error) {
      console.warn('Error preloading track:', error);
      return null;
    }
  }
}

export const playlistPreloader = new PlaylistPreloader();
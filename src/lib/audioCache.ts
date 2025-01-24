// Audio cache implementation using IndexedDB
import { Track } from '../types';

const DB_NAME = 'audioCache';
const STORE_NAME = 'tracks';
const DB_VERSION = 1;

class AudioCache {
  private db: IDBDatabase | null = null;
  private readonly maxCacheSize = 100 * 1024 * 1024; // 100MB cache limit

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async cacheTrack(track: Track, audioData: ArrayBuffer): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Cache the track data
    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        id: track.id,
        audioData,
        timestamp: Date.now()
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });

    // Cleanup old cache entries if needed
    await this.cleanupCache();
  }

  async getCachedTrack(trackId: string): Promise<ArrayBuffer | null> {
    if (!this.db) return null;

    const transaction = this.db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(trackId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result?.audioData || null);
      };
    });
  }

  private async cleanupCache(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const entries = await new Promise<any[]>((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    let totalSize = entries.reduce((size, entry) => size + entry.audioData.byteLength, 0);

    if (totalSize > this.maxCacheSize) {
      // Sort by timestamp and remove oldest entries
      entries.sort((a, b) => a.timestamp - b.timestamp);

      while (totalSize > this.maxCacheSize * 0.8 && entries.length > 0) {
        const entry = entries.shift();
        if (entry) {
          totalSize -= entry.audioData.byteLength;
          await store.delete(entry.id);
        }
      }
    }
  }
}

export const audioCache = new AudioCache();
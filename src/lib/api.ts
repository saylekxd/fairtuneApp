import { supabase } from './supabase';
import type { Track } from '../types';

// Cache dla danych
const cache = new Map<string, {
  data: any;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minut

// Funkcja pomocnicza do sprawdzania cache
const getCached = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Funkcja pomocnicza do zapisywania w cache
const setCached = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Pobierz wszystkie potrzebne dane dla strony głównej w jednym zapytaniu
export const getInitialData = async () => {
  const cached = getCached('initialData');
  if (cached) return cached;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [tracksResponse, likesResponse] = await Promise.all([
    supabase.from('tracks')
      .select('*')
      .in('genre', ['Pop', 'Rock', 'Hip Hop'])
      .order('created_at', { ascending: false })
      .limit(18),
    supabase.from('liked_tracks')
      .select('track_id')
      .eq('user_id', user.id)
  ]);

  const result = {
    tracks: tracksResponse.data || [],
    likedTracks: new Set((likesResponse.data || []).map(like => like.track_id))
  };

  setCached('initialData', result);
  return result;
};
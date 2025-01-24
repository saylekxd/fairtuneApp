export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string | null;
  genre?: string;
  is_explicit: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  shuffle_enabled: boolean;
  explicit_filter_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoiceMessage {
  id: string;
  text: string;
  audioUrl: string;
  voiceId: string;
  timestamp: number;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  created_at: string;
}
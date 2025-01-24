import React, { useState, useEffect, memo, useCallback } from 'react';
import { Play, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import type { Track } from '../../types';

const GENRE_COVERS = {
  'Pop': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&w=400&q=75',
  'Rock': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&w=400&q=75',
  'Hip Hop': 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?auto=format&w=400&q=75'
} as const;

// Rest of the file remains unchanged
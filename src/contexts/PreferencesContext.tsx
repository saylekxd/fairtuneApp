import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const defaultPreferences: Preferences = {
  theme: 'dark',
  fontSize: 'medium',
  compactMode: false,
  highContrast: false,
  reducedMotion: false
};

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {}
});

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    if (preferences.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(preferences.theme);
    }

    // Apply font size
    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    document.documentElement.classList.add(`text-size-${preferences.fontSize}`);

    // Apply compact mode
    document.documentElement.classList.toggle('compact-mode', preferences.compactMode);

    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', preferences.highContrast);

    // Apply reduced motion
    document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);
    if (preferences.reducedMotion) {
      document.documentElement.style.setProperty('--reduced-motion', 'reduce');
    } else {
      document.documentElement.style.removeProperty('--reduced-motion');
    }
  }, [preferences]);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (userPrefs?.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...userPrefs.preferences
        }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};
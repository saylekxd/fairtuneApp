import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Bell, 
  Lock, 
  Globe, 
  Accessibility, 
  Search,
  Moon,
  Sun,
  Info,
  RotateCcw,
  Save,
  Check,
  Construction,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '../contexts/PreferencesContext';

interface Preference {
  id: string;
  label: string;
  description: string;
  category: 'display' | 'notifications' | 'privacy' | 'language' | 'accessibility';
  type: 'toggle' | 'select' | 'radio' | 'range';
  options?: { value: string; label: string }[];
  value: any;
}

const defaultPreferences: Preference[] = [
  // Display Settings
  {
    id: 'theme',
    label: 'Theme',
    description: 'Choose between light and dark mode',
    category: 'display',
    type: 'radio',
    options: [
      { value: 'dark', label: 'Dark' },
      { value: 'light', label: 'Light' },
      { value: 'system', label: 'System' }
    ],
    value: 'dark'
  },
  {
    id: 'fontSize',
    label: 'Font Size',
    description: 'Adjust the size of text throughout the application',
    category: 'display',
    type: 'select',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' }
    ],
    value: 'medium'
  },
  {
    id: 'compactMode',
    label: 'Compact Mode',
    description: 'Display more content with reduced spacing',
    category: 'display',
    type: 'toggle',
    value: false
  },

  // Notification Settings
  {
    id: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Receive updates and alerts via email',
    category: 'notifications',
    type: 'toggle',
    value: true
  },
  {
    id: 'pushNotifications',
    label: 'Push Notifications',
    description: 'Receive instant notifications in your browser',
    category: 'notifications',
    type: 'toggle',
    value: true
  },
  {
    id: 'notificationSound',
    label: 'Notification Sound',
    description: 'Play a sound when receiving notifications',
    category: 'notifications',
    type: 'toggle',
    value: true
  },

  // Privacy Settings
  {
    id: 'profileVisibility',
    label: 'Profile Visibility',
    description: 'Control who can see your profile',
    category: 'privacy',
    type: 'select',
    options: [
      { value: 'public', label: 'Public' },
      { value: 'private', label: 'Private' },
      { value: 'friends', label: 'Friends Only' }
    ],
    value: 'public'
  },
  {
    id: 'dataSharing',
    label: 'Data Sharing',
    description: 'Allow anonymous usage data collection to improve our service',
    category: 'privacy',
    type: 'toggle',
    value: true
  },

  // Language Settings
  {
    id: 'language',
    label: 'Language',
    description: 'Choose your preferred language',
    category: 'language',
    type: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
      { value: 'fr', label: 'Français' },
      { value: 'de', label: 'Deutsch' }
    ],
    value: 'en'
  },
  {
    id: 'region',
    label: 'Region',
    description: 'Set your location for localized content',
    category: 'language',
    type: 'select',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'eu', label: 'Europe' },
      { value: 'asia', label: 'Asia' }
    ],
    value: 'us'
  },

  // Accessibility Settings
  {
    id: 'highContrast',
    label: 'High Contrast',
    description: 'Increase contrast for better visibility',
    category: 'accessibility',
    type: 'toggle',
    value: false
  },
  {
    id: 'reducedMotion',
    label: 'Reduced Motion',
    description: 'Minimize animations and transitions',
    category: 'accessibility',
    type: 'toggle',
    value: false
  }
];

const categories = [
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility }
];

export default function PreferencesPage() {
  const { preferences: globalPreferences, updatePreference } = usePreferences();
  const [preferences, setPreferences] = useState<Preference[]>(defaultPreferences);
  const [activeCategory, setActiveCategory] = useState('display');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    // Update local preferences with global preferences
    setPreferences(prev => prev.map(p => {
      if (p.id in globalPreferences) {
        return { ...p, value: globalPreferences[p.id as keyof typeof globalPreferences] };
      }
      return p;
    }));
  }, [globalPreferences]);

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
        setPreferences(prev => 
          prev.map(p => ({
            ...p,
            value: userPrefs.preferences[p.id] ?? p.value
          }))
        );
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const preferencesObject = preferences.reduce((acc, pref) => ({
        ...acc,
        [pref.id]: pref.value
      }), {});

      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences: preferencesObject,
          updated_at: new Date().toISOString()
        });

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  const handlePreferenceChange = (id: string, value: any) => {
    setPreferences(prev =>
      prev.map(p => p.id === id ? { ...p, value } : p)
    );

    // Update global preferences for display settings
    if (id === 'theme' || id === 'fontSize' || id === 'compactMode') {
      updatePreference(id as keyof typeof globalPreferences, value);
    }
  };

  const filteredPreferences = preferences.filter(pref => {
    const matchesSearch = searchQuery.trim() === '' ||
      pref.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pref.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = pref.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Build Mode Banner - Made responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-3 md:p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Construction className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-yellow-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                Build Mode Active
              </h3>
              <p className="text-sm md:text-base text-yellow-200/80">
                The Preferences tool is currently under development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Header - Made responsive */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold">Preferences</h2>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={resetToDefaults}
              className="md:flex items-center gap-2 px-2 md:px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset</span>
            </button>
            <button
              onClick={savePreferences}
              disabled={saving}
              className="flex items-center gap-2 px-3 md:px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden md:inline">Save Changes</span>
            </button>
          </div>
        </div>

        {/* Search - Made responsive */}
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search preferences..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Mobile Category Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              <span>Categories</span>
            </div>
            <span className="text-zinc-400">{categories.find(c => c.id === activeCategory)?.label}</span>
          </button>
        </div>

        {/* Mobile Category Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="absolute inset-y-0 left-0 w-3/4 bg-zinc-900 p-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Categories</h3>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span>{category.label}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Desktop Categories */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <nav className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Preferences Content - Made responsive */}
          <div className="flex-1 bg-zinc-800/50 rounded-lg p-3 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 md:space-y-6"
              >
                {filteredPreferences.map(pref => (
                  <div key={pref.id} className="relative group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-zinc-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{pref.label}</h3>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="More information"
                          >
                            <Info className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>
                        <p className="text-sm text-zinc-400">{pref.description}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 md:pt-0">
                        {pref.type === 'toggle' && (
                          <button
                            onClick={() => handlePreferenceChange(pref.id, !pref.value)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              pref.value ? 'bg-blue-500' : 'bg-zinc-700'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                pref.value ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}

                        {pref.type === 'select' && (
                          <select
                            value={pref.value}
                            onChange={(e) => handlePreferenceChange(pref.id, e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                          >
                            {pref.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {pref.type === 'radio' && (
                          <div className="flex items-center gap-2">
                            {pref.options?.map(option => (
                              <button
                                key={option.value}
                                onClick={() => handlePreferenceChange(pref.id, option.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  pref.value === option.value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Success Message - Made responsive */}
      <AnimatePresence>
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Preferences saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
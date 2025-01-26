import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Music, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';
import { FlickeringGrid } from './components/ui/flickering-grid';
import { ThreeDPhotoCarousel } from './components/ui/3d-carousel';
import { Spotlight } from './components/ui/spotlight';
import { AnimatedQuotes } from './components/ui/animated-quotes';
import { AuthModal } from './components/auth/AuthModal';
import { MainNavbar } from './components/MainNavbar';
import { PreferencesProvider } from './contexts/PreferencesContext';
import PlayerLayout from './components/PlayerLayout';
import RoadmapPage from './pages/RoadmapPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FeaturesPage from './pages/FeaturesPage';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Footer } from './components/Footer';

const LandingPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
  return (
    <div className="relative">
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="#374151"
        maxOpacity={0.2}
        flickerChance={0.1}
      />
      
      <div className="relative z-10">
        <MainNavbar onLoginClick={onLoginClick} />
        <div className="w-full min-h-screen flex flex-col">
          <div className="flex-1 container mx-auto">
            <div className="flex gap-6 mt-4 items-center justify-center flex-col pt-20 md:pt-32 px-4">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 backdrop-blur-sm border border-blue-500/20"
              >
                <Music className="w-4 h-4" />
                <span className="text-sm font-medium">Inteligentne zarządzanie muzyką dla lokali</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-6xl font-bold text-center bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent relative z-10"
              >
                Nowa jakość w Twojej przestrzeni
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-blue-100/80 text-center leading-relaxed max-w-2xl"
              >
                Wspieraj niszowych artystów i personalizuj muzykę lub komunikaty w swoim lokalu, dzięki naszej innowacyjnej platformie. Transparentne rozliczenia i uczciwe tantiemy — tworzymy nową erę w kulturze dźwięku, dzięki technologiom blockchain i AI.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-row gap-3"
              >
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-black hover:bg-gray-100" 
                  onClick={onLoginClick}
                >
                  Zacznijmy <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full max-w-5xl mt-4"
              >
                <div className="h-[300px]">
                  <ThreeDPhotoCarousel />
                </div>
              </motion.div>

              <AnimatedQuotes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

// use it in the Zacznijmy component

  const handleSignUpClick = () => {
    setAuthView('signup');
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return (
      <PreferencesProvider>
        <BrowserRouter>
          <PlayerLayout />
        </BrowserRouter>
      </PreferencesProvider>
    );
  }

  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage onLoginClick={handleLoginClick} />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialView={authView}
        />
      </BrowserRouter>
    </PreferencesProvider>
  );
}
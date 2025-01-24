import React, { useState } from 'react';
import { MainNavbar } from './MainNavbar';
import { FlickeringGrid } from './ui/flickering-grid';
import { AuthModal } from './auth/AuthModal';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const handleLoginClick = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-[0.02]"></div>
      
      <FlickeringGrid
        className="absolute inset-0 z-0"
        squareSize={4}
        gridGap={6}
        color="#374151"
        maxOpacity={0.2}
        flickerChance={0.1}
      />
      
      <div className="relative z-10">
        <MainNavbar onLoginClick={handleLoginClick} />
        <div className="pt-20">
          {children}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authView}
      />
    </div>
  );
}
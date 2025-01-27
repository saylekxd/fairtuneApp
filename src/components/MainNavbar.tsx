import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainNavbarProps {
  onLoginClick: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    onLoginClick();
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => 
    window.location.pathname === path ? 'text-white' : 'text-zinc-400 hover:text-white';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-20 border-b border-white/10 bg-black/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            FAIRTUNE
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white z-50"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/roadmap" className={isActive('/roadmap')}>
            Roadmapa
          </NavLink>
          <NavLink to="/pricing" className={isActive('/pricing')}>
            Koszty
          </NavLink>
          <NavLink to="/about" className={isActive('/about')}>
            O nas
          </NavLink>
          <NavLink to="/contact" className={isActive('/contact')}>
            Kontakt
          </NavLink>
          <Button 
            size="sm" 
            onClick={handleSignIn}
            className="bg-white text-black hover:bg-gray-100"
          >
            Logowanie
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-lg min-h-screen pt-24 px-6"
            >
              <div className="flex flex-col items-center gap-6 text-lg">
                <button 
                  onClick={() => handleNavigation('/roadmap')}
                  className={isActive('/roadmap')}
                >
                  Roadmapa
                </button>
                <button 
                  onClick={() => handleNavigation('/pricing')}
                  className={isActive('/pricing')}
                >
                  Koszty
                </button>
                <button 
                  onClick={() => handleNavigation('/about')}
                  className={isActive('/about')}
                >
                  O nas
                </button>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className={isActive('/contact')}
                >
                  Kontakt
                </button>
                <Button 
                  size="lg" 
                  onClick={handleSignIn}
                  className="bg-white text-black hover:bg-gray-100 w-full"
                >
                  Logowanie
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
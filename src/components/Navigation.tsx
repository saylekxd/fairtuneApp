import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListMusic, Music, Upload, Settings, Users } from 'lucide-react';
import { useAdminStatus } from '../hooks/useAdminStatus';

interface NavigationProps {
  onItemClick?: () => void;
}

export const Navigation = ({ onItemClick }: NavigationProps) => {
  const { isAdmin, loading } = useAdminStatus();

  const baseNavItems = [
    { to: '/', icon: Home, label: 'Główna' },
    { to: '/artists', icon: Users, label: 'Artyści' },
    { to: '/playlists', icon: ListMusic, label: 'Playlisty' },
    { to: '/my-music', icon: Music, label: 'Moja muzyka' },
    { to: '/preferences', icon: Settings, label: 'Ustawienia' },
  ];

  // Add Upload Track option only for admin users
  const navItems = isAdmin 
    ? [...baseNavItems, { to: '/upload', icon: Upload, label: 'Upload Track' }]
    : baseNavItems;

  if (loading) {
    return (
      <div className="space-y-6">
        <nav className="space-y-1" role="navigation">
          {baseNavItems.map((_, index) => (
            <div
              key={index}
              className="h-[44px] bg-zinc-800/50 rounded-lg animate-pulse"
            />
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="space-y-1" role="navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 active:bg-zinc-800'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
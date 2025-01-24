import React from 'react';

interface LoadingSkeletonProps {
  type: 'track' | 'genre' | 'playlist';
  count?: number;
}

export const LoadingSkeleton = ({ type, count = 6 }: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'track':
        return (
          <div className="space-y-2">
            <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
          </div>
        );
      case 'genre':
        return (
          <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse">
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
          </div>
        );
      case 'playlist':
        return (
          <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg animate-pulse">
            <div className="w-16 h-16 bg-zinc-700 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${type === 'playlist' ? '2' : '4'} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};
import React, { memo } from 'react';
import { Heart } from 'lucide-react';
import { OptimizedImage } from '../ui/OptimizedImage';

interface GenreCardProps {
  genre: string;
  coverUrl: string;
  onSelect: () => void;
  isLiked: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
}

export const GenreCard = memo(({ 
  genre, 
  coverUrl, 
  onSelect,
  isLiked,
  onLikeToggle
}: GenreCardProps) => (
  <div className="group relative aspect-square overflow-hidden rounded-lg">
    <OptimizedImage
      src={coverUrl}
      alt={genre}
      className="w-full h-full object-cover transition-transform group-hover:scale-105"
      width={400}
      height={400}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <button
        onClick={onLikeToggle}
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
      </button>
      <button
        onClick={onSelect}
        className="absolute inset-0 flex items-end p-4"
      >
        <span className="font-medium">{genre}</span>
      </button>
    </div>
  </div>
));

GenreCard.displayName = 'GenreCard';
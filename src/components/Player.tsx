import React, { useCallback, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { useStore } from '../store/useStore';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Player: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    progress,
    duration,
    queue,
    queueIndex,
    togglePlay, 
    setVolume,
    setProgress,
    playNext,
    playPrevious,
    initAudio 
  } = useStore();

  React.useEffect(() => {
    initAudio();
  }, [initAudio]);

  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseFloat(e.target.value));
  }, [setProgress]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  const progressPercentage = useMemo(() => 
    ((progress / duration) * 100) || 0
  , [progress, duration]);

  const canPlayPrevious = queueIndex > 0;
  const canPlayNext = queueIndex < queue.length - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-gradient-to-r from-zinc-900 to-black border-t border-white/10 z-50">
      {/* Mobile Progress Bar - Now at the top edge */}
      <div className="md:hidden">
        <div className="relative w-full h-1 group touch-none">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleProgressChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ touchAction: 'none' }}
          />
          <div className="h-1 bg-zinc-800">
            <div 
              className="h-full bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-[calc(100%-4px)] flex items-center justify-between px-3 md:px-6">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 md:w-1/4 md:flex-none min-w-0">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
            {currentTrack?.cover_url ? (
              <img
                src={currentTrack.cover_url}
                alt="Album art"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="w-6 h-6 text-zinc-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate text-sm md:text-base">
              {currentTrack?.title || 'No track selected'}
            </div>
            <div className="text-xs md:text-sm text-zinc-400 truncate">
              {currentTrack?.artist}
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={playPrevious}
            className="p-2 text-white disabled:text-zinc-600"
            disabled={!canPlayPrevious}
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7" />
            )}
          </button>
          <button 
            onClick={playNext}
            className="p-2 text-white disabled:text-zinc-600"
            disabled={!canPlayNext}
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-6">
            <button 
              onClick={playPrevious}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={!canPlayPrevious}
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-4 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50"
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button 
              onClick={playNext}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={!canPlayNext}
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 px-4">
            <span className="text-xs text-zinc-400 w-10 text-right">
              {formatTime(progress)}
            </span>
            <div className="relative flex-1 h-1 group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ touchAction: 'none' }}
              />
              <div className="h-1 bg-zinc-800 rounded-full">
                <div 
                  className="h-full bg-white rounded-full group-hover:bg-blue-500 transition-colors"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-zinc-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-2 w-1/4 justify-end">
          <button
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div className="relative w-24 h-1 group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ touchAction: 'none' }}
            />
            <div className="h-1 bg-zinc-800 rounded-full">
              <div 
                className="h-full bg-white rounded-full group-hover:bg-blue-500 transition-colors"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
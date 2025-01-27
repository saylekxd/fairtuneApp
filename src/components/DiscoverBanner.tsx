import React from 'react';
import { Headphones, Music2, Radio } from 'lucide-react';

export const DiscoverBanner = () => {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Odkryj swój dźwięk
          </h1>
          <p className="text-zinc-300 text-lg mb-4">
            Przeglądaj wyselekcjonowane playlisty, popularne utwory i spersonalizowane rekomendacje
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Headphones className="w-4 h-4" />
              <span>Wysoka jakość dźwięku</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Music2 className="w-4 h-4" />
              <span>Nielimitowane playlisty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Radio className="w-4 h-4" />
              <span>Inteligentne radio</span>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Zacznij słuchać
        </button>
      </div>
    </div>
  );
};
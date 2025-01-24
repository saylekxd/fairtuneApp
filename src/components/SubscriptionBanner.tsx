import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SubscriptionBanner = () => {
  const { dismissBanner } = useStore();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1920&q=80')] mix-blend-overlay opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Sparkles className="w-5 h-5 text-blue-200 hidden sm:block flex-shrink-0" />
            <div className="text-center sm:text-left min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                Upgrade to ADNA PRO
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5 line-clamp-1">
                Get unlimited access to premium features and exclusive content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              onClick={dismissBanner}
            >
              Try Free
            </button>
            <button
              onClick={dismissBanner}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Scrolling text container */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll whitespace-nowrap inline-block">
            <span className="inline-flex items-center gap-8 text-sm font-medium">
              <span>🎉 Stay tuned! We are rolling out new features</span>
              <span>🚀 Stay tuned! We are rolling out new features</span>
              <span>✨ Stay tuned! We are rolling out new features</span>
              <span>🎯 Stay tuned! We are rolling out new features</span>
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

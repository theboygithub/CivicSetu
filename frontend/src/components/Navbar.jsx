import React from 'react';
import { Landmark, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ onReset, currentScreen }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onReset()}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-xl">Civic<span className="text-brand-600">Setu</span></span>
              <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                Civic-to-Campus
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Civic Problem to University Innovation Bridge
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Driven University Matching</span>
          </div>

          {currentScreen !== 'home' && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Start over"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start New Report</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

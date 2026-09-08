import React from 'react';
import { ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span className="font-semibold text-slate-700">CivicSetu</span>
          <span>• Bridging Civic Needs & University Innovation</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Empowering 500+ Indian Institutions
          </span>
          <span className="flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            Citizen-Centric Resolution
          </span>
        </div>

      </div>
    </footer>
  );
}

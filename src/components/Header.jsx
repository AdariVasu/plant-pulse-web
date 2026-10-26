import React from 'react';
import { Leaf, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#09120b]/90 backdrop-blur-md border-b border-[#1b3824]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <Leaf className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1">
                PlantPulse<span className="text-emerald-400">.AI</span>
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                AI Vision Pathology
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Smart Plant Health & Disease Pathology</p>
          </div>
        </div>

      </div>
    </header>
  );
}

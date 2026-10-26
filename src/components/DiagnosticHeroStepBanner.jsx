import React from 'react';
import { Camera, Search, Stethoscope, ChevronRight, Sparkles } from 'lucide-react';

export default function DiagnosticHeroStepBanner({ onTriggerUpload }) {
  return (
    <div className="w-full bg-gradient-to-br from-[#0c1f14] via-[#0d2618] to-[#07140b] border border-[#1b3824] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Instant AI Plant Doctor
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Early Plant Disease Diagnosis & Cure
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Upload a clear photo of an infected leaf or stem to get AI diagnosis within seconds powered by on-device computer vision pathology (zero setup &amp; offline ready).
            </p>
          </div>
        </div>

        {/* 3-Step Visual Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
          
          {/* Step 1 */}
          <div className="bg-[#122418]/80 border border-[#1e3f29] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Step 1</p>
              <h4 className="text-sm font-bold text-white leading-snug">Take a picture</h4>
              <p className="text-[11px] text-gray-400">Snap leaf or stem photo</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden sm:block ml-auto" />
          </div>

          {/* Step 2 */}
          <div className="bg-[#122418]/80 border border-[#1e3f29] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Step 2</p>
              <h4 className="text-sm font-bold text-white leading-snug">See diagnosis</h4>
              <p className="text-[11px] text-gray-400">AI pathogen detection</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 hidden sm:block ml-auto" />
          </div>

          {/* Step 3 */}
          <div className="bg-[#122418]/80 border border-[#1e3f29] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Step 3</p>
              <h4 className="text-sm font-bold text-white leading-snug">Get medicine</h4>
              <p className="text-[11px] text-gray-400">Organic & chemical cure</p>
            </div>
          </div>

        </div>

        {/* Primary Hero Action CTA Button */}
        <div className="pt-2">
          <button
            onClick={onTriggerUpload}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-xl shadow-blue-950/60 hover:shadow-blue-900/80 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span>Take a Picture / Scan Crop Leaf</span>
          </button>
        </div>

      </div>
    </div>
  );
}

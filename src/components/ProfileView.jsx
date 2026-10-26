import React from 'react';
import { MapPin, Shield, Sprout, CheckCircle2, Cpu } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-[#0e1a12] border border-[#1b3824] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-black text-3xl font-black flex items-center justify-center shadow-lg shadow-emerald-950/60 shrink-0">
            👨‍🌾
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              Farmer Profile
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full">
                Active Planter
              </span>
            </h2>
            <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Gujarat, India • Station: South Agri Microclimate
            </p>
            <p className="text-[11px] text-gray-400">Farm Size: 4.5 Acres • Primary Crops: Tomato, Grape, Potato, Apple, Corn</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1b3824]">
          <div className="bg-[#13261a] p-3 rounded-xl border border-[#1e3f29] text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase">AI Engine</p>
            <p className="text-xs font-bold text-emerald-400">On-Device Active</p>
          </div>
          <div className="bg-[#13261a] p-3 rounded-xl border border-[#1e3f29] text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Disease Risk</p>
            <p className="text-xs font-bold text-amber-400">Moderate</p>
          </div>
          <div className="bg-[#13261a] p-3 rounded-xl border border-[#1e3f29] text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Setup Required</p>
            <p className="text-xs font-bold text-emerald-400">Zero (Ready)</p>
          </div>
        </div>
      </div>

      {/* Engine Status Card */}
      <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-6 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          On-Device Computer Vision Engine
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#122418] p-4 rounded-xl border border-[#1e3f29]">
          <div>
            <p className="text-xs font-bold text-white">Client-Side Agronomic Pathology</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Runs 100% in your browser using HTML5 Canvas pixel analytics and clinical crop knowledge bases. No external servers or API keys needed.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready &amp; Offline</span>
          </div>
        </div>
      </div>

    </div>
  );
}

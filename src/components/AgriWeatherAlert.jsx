import React from 'react';
import { CloudSun, AlertTriangle, Droplets, Thermometer, ShieldAlert } from 'lucide-react';

export default function AgriWeatherAlert({ weatherRisk }) {
  const currentRisk = weatherRisk || {
    temp: '28°C',
    humidity: '78%',
    sporeRisk: 'HIGH',
    alert: 'High humidity accelerates blight & mildew. Spray protective fungicides before rain.'
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 text-center">
      
      {/* 100% Free Badge */}
      <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-1 rounded-full mb-4 shadow-md shadow-emerald-950/40">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>100% Free AI Plant Pathology & Agronomy</span>
      </div>

      {/* Main Headline */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
        Identify Any Crop & Heal <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
          Plant Diseases Instantly
        </span>
      </h2>

      {/* Description */}
      <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
        Upload a photo of any leaf, stem, fruit, or plant. Our AI identifies the plant species, detects infection, pests, or nutrient injuries, and provides biological & chemical remedies.
      </p>

      {/* Agri-Weather & Risk Alert Banner */}
      <div className="bg-[#112417] border border-[#1d3d27] rounded-xl p-4 max-w-3xl mx-auto shadow-lg relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3824] pb-3 mb-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span>AGRI-WEATHER & RISK ALERT</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-300 font-medium flex-wrap">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Temp: <strong className="text-white">{currentRisk.temp}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Humidity: <strong className="text-white">{currentRisk.humidity}</strong>
            </span>
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
              <ShieldAlert className="w-3 h-3 text-amber-400 mr-0.5" />
              Fungal Spore Risk: {currentRisk.sporeRisk}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">{currentRisk.alert}</p>
        </div>

      </div>

    </div>
  );
}

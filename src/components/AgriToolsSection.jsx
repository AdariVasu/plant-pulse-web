import React from 'react';
import { Calculator, Droplets, Scale, Sparkles } from 'lucide-react';

export default function AgriToolsSection({ onOpenCalculator }) {
  const tools = [
    {
      id: 'fertilizer',
      title: 'Fertilizer calculator',
      icon: <Calculator className="w-6 h-6 text-emerald-400" />,
      badge: null,
      description: 'N-P-K nutrient dosage & commercial bag calculator'
    },
    {
      id: 'pesticide',
      title: 'Pesticide calculator',
      icon: <Droplets className="w-6 h-6 text-blue-400" />,
      badge: 'New',
      description: 'Sprayer tank volume & chemical dilution ratios'
    },
    {
      id: 'farming',
      title: 'Farming calculator',
      icon: <Scale className="w-6 h-6 text-purple-400" />,
      badge: 'New',
      description: 'Seed rate, plant density & harvest yield targets'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
          Tools
        </h3>
        <span className="text-[11px] text-emerald-400 font-semibold">Agricultural Smart Calculators</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onOpenCalculator(tool.id)}
            className="bg-[#0e1a12] hover:bg-[#13261a] border border-[#1b3824] hover:border-emerald-500/50 rounded-2xl p-5 text-left transition-all transform hover:-translate-y-1 shadow-lg relative group cursor-pointer"
          >
            {tool.badge && (
              <span className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {tool.badge}
              </span>
            )}

            <div className="w-12 h-12 rounded-xl bg-[#14261b] border border-[#1f3f29] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>

            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              {tool.title}
            </h4>
            <p className="text-xs text-gray-400 leading-snug">
              {tool.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

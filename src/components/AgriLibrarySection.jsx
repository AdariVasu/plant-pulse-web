import React from 'react';
import { Sprout, Bug, Lightbulb, AlertTriangle } from 'lucide-react';

export default function AgriLibrarySection({ onOpenLibrary }) {
  const libraryCards = [
    {
      id: 'crops',
      title: 'Crops',
      icon: <Sprout className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
      description: 'Crop catalog & growth guides'
    },
    {
      id: 'pests',
      title: 'Pests & diseases',
      icon: <Bug className="w-5 h-5 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
      description: 'Pathology & insect identifier'
    },
    {
      id: 'tips',
      title: 'Cultivation Tips',
      icon: <Lightbulb className="w-5 h-5 text-blue-400" />,
      bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
      description: 'Soil, irrigation & IPM best practices'
    },
    {
      id: 'alerts',
      title: 'Pests & Disease Alert',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      bg: 'bg-red-500/10 border-red-500/20 hover:border-red-500/50',
      description: 'Regional outbreak warnings'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white tracking-wide">Library</h3>
        <span className="text-[11px] text-gray-400">Agronomic Knowledge Base</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {libraryCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onOpenLibrary(card.id)}
            className={`border rounded-2xl p-5 text-left transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-between group cursor-pointer ${card.bg}`}
          >
            <div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                {card.title}
              </h4>
              <p className="text-xs text-gray-400">
                {card.description}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#09120b]/60 border border-white/10 flex items-center justify-center shrink-0 ml-3 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

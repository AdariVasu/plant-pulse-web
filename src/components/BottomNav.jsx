import React from 'react';
import { Sprout, MessageSquare, ShoppingBag, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'your_crops',
      label: 'Your crops',
      icon: <Sprout className="w-5 h-5" />
    },
    {
      id: 'community',
      label: 'Community',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 'market',
      label: 'Market',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      id: 'you',
      label: 'You',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-[#09120b]/95 backdrop-blur-lg border-t border-[#1b3824]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive ? 'text-emerald-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`px-4 py-1 rounded-full transition-all ${
                isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-transparent'
              }`}>
                {tab.icon}
              </div>
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

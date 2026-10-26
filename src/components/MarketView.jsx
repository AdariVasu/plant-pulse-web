import React, { useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, Check, Search, Filter } from 'lucide-react';
import { MARKETPLACE_ITEMS } from '../data/plantDatabase';

export default function MarketView() {
  const [items, setItems] = useState(MARKETPLACE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedId, setPurchasedId] = useState(null);

  const categories = ['All', 'Fungicide', 'Biological Control', 'Organic Insecticide', 'Equipment'];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBuy = (id) => {
    setPurchasedId(id);
    setTimeout(() => {
      setPurchasedId(null);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c1f14] to-[#122c1b] border border-[#1b3824] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit mb-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Verified Crop Protection Store
          </span>
          <h2 className="text-xl font-black text-white">Agronomic Remedies & Medicines</h2>
          <p className="text-xs text-gray-300">Certified bio-fungicides, copper sprays, neem oils & knapsack equipment</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-950'
                  : 'bg-[#13261a] hover:bg-[#1f3f2a] text-gray-300 border border-[#1e3f29]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search crop medicine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isJustBought = purchasedId === item.id;
          return (
            <div key={item.id} className="bg-[#0e1a12] border border-[#1b3824] hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all transform hover:-translate-y-1 group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#14261b] border border-[#1f3f29] text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.image}
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider mb-1">{item.category}</p>
                <h4 className="text-sm font-bold text-white leading-snug mb-1">{item.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#1b3824]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                    <span className="text-[10px] text-gray-500 font-normal">({item.reviews})</span>
                  </div>
                  <span className="text-base font-black text-white">{item.price}</span>
                </div>

                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={isJustBought}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isJustBought
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#14291c] hover:bg-emerald-600 hover:text-black text-gray-200 border border-[#1e3f29]'
                  }`}
                >
                  {isJustBought ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Order Placed!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy Remedy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

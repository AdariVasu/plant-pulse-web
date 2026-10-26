import React, { useState } from 'react';
import { Plus, Check, Sprout, Sparkles } from 'lucide-react';
import { CROPS_LIST } from '../data/plantDatabase';

export default function CropsSelectorBar({ selectedCropId, onSelectCrop }) {
  const [crops, setCrops] = useState(CROPS_LIST);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCropName, setNewCropName] = useState('');
  const [newCropCategory, setNewCropCategory] = useState('Cereals');

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!newCropName.trim()) return;
    const newCrop = {
      id: newCropName.toLowerCase().replace(/\s+/g, '_'),
      name: newCropName.trim(),
      icon: '🌱',
      category: newCropCategory,
      active: false
    };
    setCrops(prev => [...prev, newCrop]);
    onSelectCrop(newCrop.id);
    setNewCropName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full bg-[#0d1a10] border border-[#1b3824] rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-200 tracking-wide">Your Farm Crops</h3>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
            {crops.length} Selected
          </span>
        </div>
        <span className="text-[11px] text-gray-400">Select crop to filter AI diagnosis & advice</span>
      </div>

      {/* Horizontal Scroll Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent">
        {crops.map((crop) => {
          const isSelected = selectedCropId === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => onSelectCrop(crop.id)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-400 text-white shadow-lg shadow-emerald-950/60 scale-[1.02]'
                  : 'bg-[#13261a] hover:bg-[#1a3323] border-[#1e3f29] text-gray-300 hover:text-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                isSelected ? 'bg-white/20' : 'bg-[#09120b]'
              }`}>
                {crop.icon}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">{crop.name}</p>
                <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {crop.category}
                </p>
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 ml-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}

        {/* Add Crop Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 hover:text-blue-300 font-bold text-xs transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span>Add Crop</span>
        </button>
      </div>

      {/* Add Crop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1c12] border border-[#1e3e27] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b3824] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Add New Farm Crop
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Crop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sugarcane, Mango, Wheat..."
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={newCropCategory}
                  onChange={(e) => setNewCropCategory(e.target.value)}
                  className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Cereals">Cereals & Grains</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits & Orchards</option>
                  <option value="Cash Crop">Cash Crop</option>
                  <option value="Tubers">Roots & Tubers</option>
                  <option value="Fiber">Fiber Crops</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a3323] hover:bg-[#22442e] text-gray-300 font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-black font-bold text-xs hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-950"
                >
                  Save & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

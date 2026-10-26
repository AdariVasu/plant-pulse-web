import React, { useState } from 'react';
import { X, BookOpen, Bug, Sprout, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { CROPS_LIST, PLANT_DISEASES_DATABASE } from '../data/plantDatabase';

export default function LibraryModal({ isOpen, onClose, initialCategory = 'crops' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'crops', name: 'Crops', icon: '🌾' },
    { id: 'pests', name: 'Pests & Diseases', icon: '🐛' },
    { id: 'tips', name: 'Cultivation Tips', icon: '🌱' },
    { id: 'alerts', name: 'Disease Alerts', icon: '⚠️' }
  ];

  const filteredDiseases = PLANT_DISEASES_DATABASE.filter(d => 
    d.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.diseaseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1810] border border-[#1b3824] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1b3824] flex items-center justify-between bg-[#081009]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agronomic Knowledge Library</h3>
              <p className="text-xs text-gray-400">Crop care guides, disease pathology & IPM best practices</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#13261a] hover:bg-[#1f3f2a] text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 border-b border-[#1b3824] bg-[#09120b]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedItem(null);
              }}
              className={`py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeCategory === cat.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#1b3824] bg-[#0e1c12]">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search crops, fungal spots, insect pests, or tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Library Items Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">

          {/* CROPS CATALOG */}
          {activeCategory === 'crops' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CROPS_LIST.map((crop) => (
                <div key={crop.id} className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#182f20] text-2xl flex items-center justify-center border border-[#23442f]">
                    {crop.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{crop.name}</h4>
                    <p className="text-xs text-emerald-400 font-medium">{crop.category}</p>
                    <p className="text-[10px] text-gray-400">Optimal pH: 6.0-7.0 • Ideal Temp: 22-30°C</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PESTS & DISEASES */}
          {activeCategory === 'pests' && (
            <div className="space-y-4">
              {filteredDiseases.map((d) => (
                <div key={d.id} className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">
                        {d.cropName}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{d.diseaseName}</h4>
                      <p className="text-xs text-gray-400 italic">{d.botanicalName}</p>
                    </div>
                  </div>

                  <div className="bg-[#0a140d] p-3 rounded-xl border border-[#1b3824]">
                    <p className="text-xs text-gray-300 font-semibold mb-1">Key Diagnostic Symptoms:</p>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                      {d.symptoms.slice(0, 2).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CULTIVATION TIPS */}
          {activeCategory === 'tips' && (
            <div className="space-y-4">
              <div className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400">🌱 Integrated Pest Management (IPM)</h4>
                <p className="text-xs text-gray-300">
                  Combine biological agents (Trichoderma, Bacillus) with crop rotation and clean field sanitation before turning to synthetic fungicides.
                </p>
              </div>

              <div className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-blue-400">💧 Drip Irrigation & Canopy Aeration</h4>
                <p className="text-xs text-gray-300">
                  Avoid overhead sprinkler irrigation late in the evening. Wet leaves overnight encourage fungal spore germination (downy mildew & blight).
                </p>
              </div>

              <div className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-4 space-y-2">
                <h4 className="text-sm font-bold text-purple-400">🌾 Soil Organic Mulching</h4>
                <p className="text-xs text-gray-300">
                  Applying a 5-7cm layer of organic straw mulch prevents soil-borne fungal spores from splashing onto lower leaves during heavy rain.
                </p>
              </div>
            </div>
          )}

          {/* DISEASE OUTBREAK ALERTS */}
          {activeCategory === 'alerts' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">High Humidity Early Blight Warning</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Monsoon rain and relative humidity above 80% have increased risk of Alternaria solani in Solanaceous crops. Apply protective bio-fungicide sprays preemptively.
                  </p>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-300">Fall Armyworm Advisory</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    Pest traps in maize fields report high Spodoptera frugiperda moth activity. Inspect leaf whorls weekly for egg masses.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

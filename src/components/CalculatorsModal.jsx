import React, { useState } from 'react';
import { Calculator, X, Sparkles, Droplets, Leaf, Scale } from 'lucide-react';

export default function CalculatorsModal({ isOpen, onClose, initialTab = 'fertilizer' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fertilizer Calculator State
  const [fertCrop, setFertCrop] = useState('Rice');
  const [fertArea, setFertArea] = useState(1); // acres
  const [fertAreaUnit, setFertAreaUnit] = useState('acre');
  const [targetYield, setTargetYield] = useState(25); // quintals/acre

  // Pesticide Calculator State
  const [tankSize, setTankSize] = useState(15); // liters per tank
  const [totalWaterVolume, setTotalWaterVolume] = useState(150); // total field liters
  const [chemicalDosageRate, setChemicalDosageRate] = useState(2); // ml or g per liter

  // Farming Calculator State
  const [rowSpacing, setRowSpacing] = useState(60); // cm
  const [plantSpacing, setPlantSpacing] = useState(20); // cm
  const [germinationRate, setGerminationRate] = useState(85); // %

  if (!isOpen) return null;

  // Fertilizer Formulas
  const areaInAcres = fertAreaUnit === 'hectare' ? fertArea * 2.471 : fertArea;
  let baseN = 40, baseP = 20, baseK = 20; // kg/acre baseline
  if (fertCrop === 'Rice') { baseN = 50; baseP = 25; baseK = 25; }
  else if (fertCrop === 'Maize') { baseN = 60; baseP = 30; baseK = 30; }
  else if (fertCrop === 'Tomato') { baseN = 45; baseP = 35; baseK = 40; }
  else if (fertCrop === 'Potato') { baseN = 55; baseP = 40; baseK = 45; }

  const totalN = Math.round(baseN * areaInAcres);
  const totalP = Math.round(baseP * areaInAcres);
  const totalK = Math.round(baseK * areaInAcres);

  // Commercial Fertilizer equivalents
  const dapKg = Math.round(totalP / 0.46);
  const ureaKg = Math.round(Math.max(0, totalN - (dapKg * 0.18)) / 0.46);
  const mopKg = Math.round(totalK / 0.60);

  // Pesticide Formulas
  const totalChemicalMl = Math.round(totalWaterVolume * chemicalDosageRate);
  const totalTanks = Math.ceil(totalWaterVolume / tankSize);
  const chemicalPerTank = (tankSize * chemicalDosageRate).toFixed(1);

  // Farming Density Formulas
  const areaSqMeters = areaInAcres * 4046.86;
  const areaPerPlantSqMeters = (rowSpacing / 100) * (plantSpacing / 100);
  const rawPlantPopulation = Math.round(areaSqMeters / areaPerPlantSqMeters);
  const requiredSeedsKg = ((rawPlantPopulation / (germinationRate / 100)) * 0.00025).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c1810] border border-[#1b3824] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1b3824] flex items-center justify-between bg-[#081009]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Agronomic Calculators
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Precision Agriculture
                </span>
              </h3>
              <p className="text-xs text-gray-400">Calculate exact fertilizer, pesticide dilution & plant density</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#13261a] hover:bg-[#1f3f2a] text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 border-b border-[#1b3824] bg-[#09120b]">
          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'fertilizer'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Fertilizer</span>
          </button>
          <button
            onClick={() => setActiveTab('pesticide')}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'pesticide'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Pesticide</span>
          </button>
          <button
            onClick={() => setActiveTab('farming')}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'farming'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Farming & Yield</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* FERTILIZER CALCULATOR TAB */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Crop</label>
                  <select
                    value={fertCrop}
                    onChange={(e) => setFertCrop(e.target.value)}
                    className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Rice">Rice Paddy</option>
                    <option value="Maize">Maize / Corn</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Field Size</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={fertArea}
                      onChange={(e) => setFertArea(Math.max(0.1, parseFloat(e.target.value) || 1))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={fertAreaUnit}
                      onChange={(e) => setFertAreaUnit(e.target.value)}
                      className="bg-[#13261a] border border-[#1e3f29] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="acre">Acres</option>
                      <option value="hectare">Hectares</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calculated NPK Results */}
              <div className="bg-[#112217] border border-[#1d3d2a] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Recommended N-P-K Nutrient Requirements
                </h4>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#182f20] p-3 rounded-xl border border-[#22442e]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nitrogen (N)</p>
                    <p className="text-lg font-black text-emerald-400">{totalN} kg</p>
                  </div>
                  <div className="bg-[#182f20] p-3 rounded-xl border border-[#22442e]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Phosphorus (P₂O₅)</p>
                    <p className="text-lg font-black text-blue-400">{totalP} kg</p>
                  </div>
                  <div className="bg-[#182f20] p-3 rounded-xl border border-[#22442e]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Potassium (K₂O)</p>
                    <p className="text-lg font-black text-purple-400">{totalK} kg</p>
                  </div>
                </div>

                <div className="border-t border-[#1d3d2a] pt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-200">Commercial Fertilizer Bags Needed:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-[#09140c] p-2.5 rounded-lg border border-[#1b3824] flex justify-between">
                      <span className="text-gray-400">Urea (46% N):</span>
                      <span className="font-bold text-white">{ureaKg} kg</span>
                    </div>
                    <div className="bg-[#09140c] p-2.5 rounded-lg border border-[#1b3824] flex justify-between">
                      <span className="text-gray-400">DAP (18-46-0):</span>
                      <span className="font-bold text-white">{dapKg} kg</span>
                    </div>
                    <div className="bg-[#09140c] p-2.5 rounded-lg border border-[#1b3824] flex justify-between">
                      <span className="text-gray-400">MOP (60% K):</span>
                      <span className="font-bold text-white">{mopKg} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PESTICIDE CALCULATOR TAB */}
          {activeTab === 'pesticide' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Knapsack Tank Size</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tankSize}
                      onChange={(e) => setTankSize(Math.max(1, parseFloat(e.target.value) || 15))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">Liters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Total Water Volume</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={totalWaterVolume}
                      onChange={(e) => setTotalWaterVolume(Math.max(1, parseFloat(e.target.value) || 150))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">Liters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Dosage Rate per Liter</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={chemicalDosageRate}
                      onChange={(e) => setChemicalDosageRate(Math.max(0.1, parseFloat(e.target.value) || 2))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">ml/g</span>
                  </div>
                </div>
              </div>

              {/* Calculated Spray Mix Results */}
              <div className="bg-[#101b2b] border border-[#1e3452] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" />
                  Spray Mix & Tank Dilution Results
                </h4>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#17273d] p-3 rounded-xl border border-[#233a5b]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total Chemical Needed</p>
                    <p className="text-lg font-black text-blue-400">{totalChemicalMl} ml/g</p>
                  </div>
                  <div className="bg-[#17273d] p-3 rounded-xl border border-[#233a5b]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Tanks to Fill</p>
                    <p className="text-lg font-black text-emerald-400">{totalTanks} Tanks</p>
                  </div>
                  <div className="bg-[#17273d] p-3 rounded-xl border border-[#233a5b]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Dose Per Tank</p>
                    <p className="text-lg font-black text-purple-400">{chemicalPerTank} ml/g</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 italic">
                  💡 Safety Tip: Always mix chemical in a small bucket of water before pouring into sprayer tank. Use PPE gloves & mask.
                </p>
              </div>
            </div>
          )}

          {/* FARMING & YIELD CALCULATOR TAB */}
          {activeTab === 'farming' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Row-to-Row Spacing</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rowSpacing}
                      onChange={(e) => setRowSpacing(Math.max(10, parseFloat(e.target.value) || 60))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Plant-to-Plant Spacing</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={plantSpacing}
                      onChange={(e) => setPlantSpacing(Math.max(5, parseFloat(e.target.value) || 20))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">cm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Germination Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={germinationRate}
                      onChange={(e) => setGerminationRate(Math.min(100, Math.max(50, parseFloat(e.target.value) || 85)))}
                      className="w-full bg-[#13261a] border border-[#1e3f29] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              {/* Calculated Plant Population */}
              <div className="bg-[#1f102b] border border-[#371d4d] rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Estimated Field Plant Density & Seed Rate
                </h4>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#2d183f] p-4 rounded-xl border border-[#43235d]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Target Plant Population</p>
                    <p className="text-xl font-black text-purple-300">{rawPlantPopulation.toLocaleString()} plants/acre</p>
                  </div>
                  <div className="bg-[#2d183f] p-4 rounded-xl border border-[#43235d]">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Seed Required</p>
                    <p className="text-xl font-black text-emerald-400">{requiredSeedsKg} kg / acre</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

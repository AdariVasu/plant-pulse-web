import React, { useState } from 'react';
import { Calculator, X, Droplets, ShieldAlert } from 'lucide-react';

export default function DosageModal({ isOpen, onClose }) {
  const [landArea, setLandArea] = useState(1);
  const [unit, setUnit] = useState('acres'); // 'acres', 'hectares', 'sqm'
  const [tankSize, setTankSize] = useState(15); // Liters per backpack sprayer
  const [chemType, setChemType] = useState('mancozeb');

  if (!isOpen) return null;

  // Calculation formulas
  // Mancozeb rate: 2.5g per Liter -> ~500g per acre in 200L water
  // Copper Hydroxide: 2g per Liter -> ~400g per acre in 200L water
  // Neem Oil: 5ml per Liter -> ~1000ml per acre in 200L water
  let ratePerLiter = 2.5; // grams or ml
  let chemName = "Mancozeb 75% WP";
  let unitMeasure = "grams";

  if (chemType === 'copper') {
    ratePerLiter = 2.0;
    chemName = "Copper Hydroxide 77% WP";
    unitMeasure = "grams";
  } else if (chemType === 'neem') {
    ratePerLiter = 5.0;
    chemName = "Cold-Pressed Neem Oil (10,000 ppm)";
    unitMeasure = "ml";
  } else if (chemType === 'azoxystrobin') {
    ratePerLiter = 1.0;
    chemName = "Azoxystrobin + Difenoconazole";
    unitMeasure = "ml";
  }

  // Convert area to acres equivalent
  let areaInAcres = landArea;
  if (unit === 'hectares') areaInAcres = landArea * 2.471;
  if (unit === 'sqm') areaInAcres = landArea / 4046.86;

  const totalWaterLiters = Math.round(areaInAcres * 200);
  const totalChemicalNeeded = Math.round(totalWaterLiters * ratePerLiter);
  const numberOfTanks = Math.ceil(totalWaterLiters / tankSize);
  const chemicalPerTank = Math.round(tankSize * ratePerLiter * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1f14] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-gray-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1a3322]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-4 border-b border-[#1c3a25] pb-3">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <span>Fungicide & Pesticide Spray Dosage Calculator</span>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Land Area Input */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Total Field / Land Area:</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                className="bg-[#14261a] border border-[#20402b] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:border-emerald-500 font-bold"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-[#14261a] border border-[#20402b] text-emerald-300 font-semibold px-3 py-2 rounded-lg cursor-pointer"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="sqm">Sq Meters</option>
              </select>
            </div>
          </div>

          {/* Chemical Formulation Selection */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Target Remedial Formulation:</label>
            <select
              value={chemType}
              onChange={(e) => setChemType(e.target.value)}
              className="bg-[#14261a] border border-[#20402b] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="mancozeb">Mancozeb 75% WP (2.5g/L - Broad Spectrum)</option>
              <option value="copper">Copper Hydroxide 77% WP (2.0g/L - Organic / Bacterial)</option>
              <option value="neem">Neem Oil (5.0ml/L - Organic Bio-Pesticide)</option>
              <option value="azoxystrobin">Azoxystrobin + Difenoconazole (1.0ml/L - Systemic)</option>
            </select>
          </div>

          {/* Knapsack Sprayer Capacity */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Sprayer Tank Size (Liters):</label>
            <input
              type="number"
              min="1"
              value={tankSize}
              onChange={(e) => setTankSize(parseInt(e.target.value) || 15)}
              className="bg-[#14261a] border border-[#20402b] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          {/* Result Output Cards */}
          <div className="bg-[#142a1c] border border-emerald-500/30 rounded-xl p-4 mt-4 space-y-3">
            <h5 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Recommended Plan for {chemName}</span>
            </h5>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0e1d13] p-2.5 rounded-lg border border-[#1d3d27]">
                <span className="text-gray-400 block text-[10px]">Total Water Required</span>
                <strong className="text-white text-sm">{totalWaterLiters} Liters</strong>
              </div>

              <div className="bg-[#0e1d13] p-2.5 rounded-lg border border-[#1d3d27]">
                <span className="text-gray-400 block text-[10px]">Total Chemical Required</span>
                <strong className="text-emerald-400 text-sm">{totalChemicalNeeded} {unitMeasure}</strong>
              </div>

              <div className="bg-[#0e1d13] p-2.5 rounded-lg border border-[#1d3d27]">
                <span className="text-gray-400 block text-[10px]">Number of Knapsack Refills</span>
                <strong className="text-amber-400 text-sm">{numberOfTanks} Tank Loads</strong>
              </div>

              <div className="bg-[#0e1d13] p-2.5 rounded-lg border border-[#1d3d27]">
                <span className="text-gray-400 block text-[10px]">Dose per {tankSize}L Tank</span>
                <strong className="text-sky-300 text-sm">{chemicalPerTank} {unitMeasure}</strong>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg flex items-start gap-2 text-[11px] text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Safety Note: Always wear protective masks, rubber gloves, and eye goggles during mixing and application. Spray during early morning or late afternoon.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

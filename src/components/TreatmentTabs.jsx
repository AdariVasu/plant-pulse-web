import React, { useState } from 'react';
import { Eye, AlertCircle, Leaf, TestTube, ShieldCheck, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';

export default function TreatmentTabs({ diagnosis }) {
  const [activeTab, setActiveTab] = useState('immediate');

  if (!diagnosis) return null;

  // Hide treatment tabs if image was rejected as non-plant
  if (diagnosis.healthStatus === 'NOT_A_PLANT' || diagnosis.isNotPlant || diagnosis.status === 'NOT_A_PLANT' || diagnosis.isPlant === false) {
    return null;
  }

  const isHealthy = diagnosis.status === 'HEALTHY' || diagnosis.healthStatus === 'HEALTHY';
  const diseaseName = diagnosis.disease?.name || diagnosis.diseaseName || (isHealthy ? 'Healthy Foliage (No Pathology Detected)' : 'Condition Under Observation');
  const symptoms = diagnosis.symptoms || diagnosis.observedSymptoms || [];

  // Robust Normalization for Immediate Actions Protocol
  const getImmediateActions = () => {
    if (Array.isArray(diagnosis.treatment?.immediate)) return diagnosis.treatment.immediate;
    if (Array.isArray(diagnosis.treatment?.immediateActions)) return diagnosis.treatment.immediateActions;
    if (Array.isArray(diagnosis.treatment?.immediateAction)) return diagnosis.treatment.immediateAction;
    if (Array.isArray(diagnosis.immediateAction)) return diagnosis.immediateAction;
    if (Array.isArray(diagnosis.immediateActions)) return diagnosis.immediateActions;
    
    if (Array.isArray(diagnosis.treatment) && diagnosis.treatment.length > 0) {
      const filtered = diagnosis.treatment.filter(t => 
        /prune|destroy|isolate|remove|avoid|stop|clean|hand-pick|immediately|water/i.test(t)
      );
      if (filtered.length > 0) return filtered;
      return [diagnosis.treatment[0]];
    }

    if (isHealthy) {
      return [
        "Continue regular watering and crop inspection routine.",
        "Ensure appropriate soil aeration and drainage.",
        "No emergency intervention required for healthy foliage."
      ];
    }

    return [
      "Isolate affected foliage to prevent spore transmission.",
      "Prune and safely discard heavily spotted or damaged leaves.",
      "Avoid overhead sprinkler watering to keep leaf canopy dry."
    ];
  };

  // Robust Normalization for Biological / Organic Controls
  const getOrganicFixes = () => {
    if (Array.isArray(diagnosis.treatment?.organic)) return diagnosis.treatment.organic;
    if (Array.isArray(diagnosis.treatment?.biological)) return diagnosis.treatment.biological;
    if (Array.isArray(diagnosis.treatment?.biologicalManagement)) return diagnosis.treatment.biologicalManagement;
    if (Array.isArray(diagnosis.treatment?.organicFixes)) return diagnosis.treatment.organicFixes;
    if (Array.isArray(diagnosis.organicFixes)) return diagnosis.organicFixes;
    if (Array.isArray(diagnosis.biologicalManagement)) return diagnosis.biologicalManagement;
    if (Array.isArray(diagnosis.biologicalFixes)) return diagnosis.biologicalFixes;

    if (Array.isArray(diagnosis.treatment) && diagnosis.treatment.length > 0) {
      const filtered = diagnosis.treatment.filter(t => 
        /neem|bio|bacillus|trichoderma|organic|copper|compost|sulfur|bordeaux|bicarbonate|natural/i.test(t)
      );
      if (filtered.length > 0) return filtered;
      if (diagnosis.treatment[1]) return [diagnosis.treatment[1]];
    }

    if (isHealthy) {
      return [
        "Apply organic vermicompost tea to promote beneficial root soil microbes.",
        "Use cold-pressed neem oil spray (3ml/L) as a natural bio-protectant."
      ];
    }

    return [
      "Apply cold-pressed Neem Oil solution (5ml/L water + 1ml organic soap buffer) every 7 days.",
      "Spray bio-fungicide (Trichoderma viride or Bacillus subtilis at 5g/L water).",
      "Use Copper Hydroxide or Bordeaux Mixture (1%) to inhibit fungal spore germination."
    ];
  };

  // Robust Normalization for Chemical Management
  const getChemicalRemedies = () => {
    if (Array.isArray(diagnosis.treatment?.chemical)) return diagnosis.treatment.chemical;
    if (Array.isArray(diagnosis.treatment?.chemicalManagement)) return diagnosis.treatment.chemicalManagement;
    if (Array.isArray(diagnosis.treatment?.chemicalRemedies)) return diagnosis.treatment.chemicalRemedies;
    if (Array.isArray(diagnosis.chemicalRemedies)) return diagnosis.chemicalRemedies;
    if (Array.isArray(diagnosis.chemicalManagement)) return diagnosis.chemicalManagement;

    if (Array.isArray(diagnosis.treatment) && diagnosis.treatment.length > 0) {
      const filtered = diagnosis.treatment.filter(t => 
        /mancozeb|chlorothalonil|azoxystrobin|difenoconazole|myclobutanil|captan|tebuconazole|carbendazim|fungicide|insecticide|chemical|spray/i.test(t)
      );
      if (filtered.length > 0) return filtered;
      if (diagnosis.treatment[2]) return [diagnosis.treatment[2]];
    }

    if (isHealthy) {
      return [
        "N/A - Plant foliage is healthy. No synthetic chemical treatments are required.",
        "Maintain balanced N-P-K soil fertilization based on seasonal crop demand."
      ];
    }

    return [
      "Spray Mancozeb 75% WP @ 2.5g / Liter water covering both upper and lower leaf surfaces.",
      "Apply Chlorothalonil 75% WP @ 2.0g / Liter water as a protective foliar barrier.",
      "Use systemic Difenoconazole + Azoxystrobin @ 1ml / Liter water for severe fungal outbreaks."
    ];
  };

  // Robust Normalization for Prevention
  const getPrevention = () => {
    if (Array.isArray(diagnosis.prevention) && diagnosis.prevention.length > 0) return diagnosis.prevention;
    if (Array.isArray(diagnosis.preventiveMeasures) && diagnosis.preventiveMeasures.length > 0) return diagnosis.preventiveMeasures;
    if (Array.isArray(diagnosis.treatment?.prevention) && diagnosis.treatment.prevention.length > 0) return diagnosis.treatment.prevention;

    return [
      "Step 1: Maintain optimal row spacing between plants for adequate sunlight & air circulation.",
      "Step 2: Practice crop rotation every 2-3 years with non-susceptible crop families.",
      "Step 3: Apply organic straw mulch around plant bases to suppress splash-borne fungal spores."
    ];
  };

  const immediateActions = getImmediateActions();
  const organicFixes = getOrganicFixes();
  const chemicalRemedies = getChemicalRemedies();
  const preventionSteps = getPrevention();

  return (
    <div className="space-y-6">
      
      {/* Diagnosed Condition Banner */}
      <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isHealthy 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}>
            {isHealthy ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
              {isHealthy ? 'HEALTH ASSESSMENT STATUS' : 'DIAGNOSED CONDITION / ISSUE'}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {diseaseName}
            </h3>
            {diagnosis.disease?.scientificName && (
              <p className="text-xs text-amber-300 font-mono italic">
                Pathogen: {diagnosis.disease.scientificName}
              </p>
            )}
          </div>
        </div>

        {/* Observed Visual Symptoms Box */}
        {symptoms.length > 0 && (
          <div className="mt-4 bg-[#122217] border border-[#1d3d27] rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide mb-3">
              <Eye className="w-4 h-4" />
              <span>OBSERVED VISUAL SYMPTOMS:</span>
            </div>

            <ul className="space-y-2 text-xs text-gray-200">
              {symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tabs Navigation Card */}
      <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 shadow-xl">
        
        {/* Navigation Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-[#1a3522] pb-3 overflow-x-auto scrollbar-none">
          
          <button
            type="button"
            onClick={() => setActiveTab('immediate')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'immediate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#14261a]'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Immediate Actions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('organic')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'organic'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#14261a]'
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Biological / Organic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chemical')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'chemical'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-[#14261a]'
            }`}
          >
            <TestTube className="w-4 h-4 text-blue-400" />
            <span>Chemical Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prevention')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prevention'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-950'
                : 'text-gray-400 hover:text-white hover:bg-[#14261a]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Prevention</span>
          </button>

        </div>

        {/* Tab Content Display */}
        <div className="pt-4">
          
          {/* TAB 1: IMMEDIATE ACTIONS */}
          {activeTab === 'immediate' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>IMMEDIATE ACTION PROTOCOL</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-200">
                {immediateActions.map((action, idx) => (
                  <li key={idx} className="bg-[#122217] border border-[#1e3c28] p-3 rounded-xl flex items-start gap-2.5">
                    <span className="bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] mt-0.5 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 2: BIOLOGICAL / ORGANIC */}
          {activeTab === 'organic' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>BIOLOGICAL & ECO-FRIENDLY CONTROLS</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-200">
                {organicFixes.map((fix, idx) => (
                  <li key={idx} className="bg-[#122217] border border-[#1e3c28] p-3 rounded-xl flex items-start gap-2.5">
                    <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 3: CHEMICAL MANAGEMENT */}
          {activeTab === 'chemical' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                <TestTube className="w-4 h-4" />
                <span>CHEMICAL MANAGEMENT GUIDANCE</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-200">
                {chemicalRemedies.map((chem, idx) => (
                  <li key={idx} className="bg-[#122217] border border-[#1e3c28] p-3 rounded-xl flex items-start gap-2.5">
                    <TestTube className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{chem}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blue-950/30 border border-blue-800/40 p-3 rounded-xl text-[11px] text-blue-200 space-y-1">
                <strong>Legal & Safety Note:</strong> Use only fungicides or insecticides officially approved for this crop and disease in your region. Always follow product label instructions for dosage, application intervals, pre-harvest intervals, and personal safety equipment.
              </div>
            </div>
          )}

          {/* TAB 4: PREVENTION */}
          {activeTab === 'prevention' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>LONG-TERM PREVENTIVE MEASURES</span>
              </h4>
              <div className="space-y-3">
                {preventionSteps.map((stepStr, idx) => {
                  const parts = stepStr.split(': ');
                  const title = parts.length > 1 ? parts[0] : `Measure ${idx + 1}`;
                  const desc = parts.length > 1 ? parts.slice(1).join(': ') : stepStr;
                  return (
                    <div key={idx} className="bg-[#122217] border border-[#1d3d27] p-3.5 rounded-xl">
                      <h5 className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span>{title}</span>
                      </h5>
                      <p className="text-xs text-gray-300 leading-relaxed pl-3.5">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Wikipedia Botanical Knowledge Card */}
      {diagnosis.wikipedia && (
        <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#183320] pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>WIKIPEDIA BOTANICAL KNOWLEDGE</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Taxonomy Reference</span>
          </div>

          <h4 className="text-sm font-bold text-white mb-1.5">{diagnosis.wikipedia.title}</h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-3">{diagnosis.wikipedia.summary}</p>

          <a
            href={diagnosis.wikipedia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-4"
          >
            <span>Read full Wikipedia article</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

    </div>
  );
}

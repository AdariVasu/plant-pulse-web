import React from 'react';
import { X, Printer, Leaf, ShieldCheck, AlertCircle, CheckCircle2, HelpCircle, Droplets, Sparkles, Sprout, AlertTriangle } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, diagnosis, imageSrc }) {
  if (!isOpen || !diagnosis) return null;

  const plant = diagnosis.plant || {};
  const health = diagnosis.health || {};
  const disease = diagnosis.disease || {};
  const possibleCause = diagnosis.possible_cause || {};
  const treatment = diagnosis.treatment || {};

  const plantName = plant.common_name || diagnosis.plant_name || 'Plant';
  const scientificName = plant.scientific_name || diagnosis.scientific_name || '';
  const plantType = plant.plant_type || diagnosis.plant_type || 'Agricultural Crop';
  const plantConfidence = Number(plant.confidence || diagnosis.plant_confidence) || 92;

  const isHealthy = health.status === 'healthy' || diagnosis.health_status === 'healthy' || diagnosis.disease?.detected === false;
  const isUncertain = health.status === 'uncertain' || diagnosis.health_status === 'uncertain';
  const isDiseased = !isHealthy && !isUncertain && (health.status === 'diseased' || diagnosis.health_status === 'diseased');

  const diseaseName = disease.name || diagnosis.disease_name || (isHealthy ? 'No visible disease detected' : 'Condition Detected');
  const diseaseType = disease.type || diagnosis.disease_type || (isHealthy ? 'None' : 'Pathology');
  const diseaseConfidence = isHealthy ? 0 : (Number(disease.confidence || diagnosis.disease_confidence) || 85);
  const severity = (disease.severity || diagnosis.severity || (isHealthy ? 'none' : 'Moderate')).toUpperCase();
  const affectedPart = disease.affected_part || diagnosis.affected_part || 'Foliage';

  const symptomsList = Array.isArray(diagnosis.symptoms) && diagnosis.symptoms.length > 0 ? diagnosis.symptoms : [];
  const plantEvidence = Array.isArray(diagnosis.plant_identification_evidence) && diagnosis.plant_identification_evidence.length > 0 ? diagnosis.plant_identification_evidence : [];
  const diseaseEvidence = Array.isArray(diagnosis.disease_evidence) && diagnosis.disease_evidence.length > 0 ? diagnosis.disease_evidence : [];

  const immediateActions = Array.isArray(treatment.immediate_actions) && treatment.immediate_actions.length > 0
    ? treatment.immediate_actions
    : (Array.isArray(diagnosis.recommended_solution) ? diagnosis.recommended_solution.slice(0, 2) : []);
  const biologicalOptions = Array.isArray(treatment.biological_options) ? treatment.biological_options : [];
  const agriculturalOptions = Array.isArray(treatment.agricultural_options) ? treatment.agricultural_options : [];
  const chemicalOptions = Array.isArray(treatment.chemical_options) ? treatment.chemical_options : [];

  const preventionTips = Array.isArray(diagnosis.prevention) ? diagnosis.prevention : [];
  const generalCareTips = Array.isArray(diagnosis.general_care) ? diagnosis.general_care : [];
  const finalSummary = diagnosis.final_summary || health.summary || diagnosis.explanation || '';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e1a12] border border-emerald-500/40 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative text-gray-200 my-8 card-surface">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-[#1c3a25] pb-4 mb-4 no-print">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Leaf className="w-5 h-5" />
            <span>PlantPulse.AI — Official Plant Pathology Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF Report</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1a3322] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-5 bg-[#09120b] border border-[#1b3824] rounded-xl space-y-5 print:p-0 print:border-none">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1f3f2a] pb-4">
            <div>
              <h2 className="text-xl font-bold text-white print:text-black flex items-center gap-2">
                PlantPulse<span className="text-emerald-400">.AI</span>
              </h2>
              <p className="text-[11px] text-emerald-400 print:text-emerald-700 uppercase font-mono font-semibold">
                Official Plant Health & Pathology Assessment
              </p>
            </div>
            <div className="text-right text-xs text-gray-400 print:text-gray-600 font-mono">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Report ID: PP-DIAG-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Section 1 & 2: Plant Identification & Image */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#102015] border border-[#1f3f2a] p-4 rounded-xl print:bg-gray-100">
            <div className="h-36 rounded-xl overflow-hidden border border-[#22442b] bg-black/50">
              <img src={imageSrc || diagnosis.image} alt="Analyzed Leaf" className="w-full h-full object-cover" />
            </div>

            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                  isDiseased 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                    : isHealthy
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isDiseased ? 'DISEASED' : (isHealthy ? 'HEALTHY' : 'UNCERTAIN')}
                </span>
                <span className="text-gray-300 font-mono print:text-gray-800">
                  Plant Confidence: <strong className="text-emerald-400 print:text-emerald-700">{plantConfidence}%</strong>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white print:text-black">
                {plantName} {scientificName && <span className="text-xs font-mono italic text-emerald-400 print:text-emerald-700">({scientificName})</span>}
              </h3>
              {plantType && <p className="text-[11px] text-gray-400 print:text-gray-600">Category: {plantType}</p>}

              {isDiseased && (
                <div className="text-amber-300 print:text-amber-800 space-y-0.5">
                  <p className="font-bold">Diagnosed Condition: {diseaseName}</p>
                  <p className="text-[11px] text-gray-300 print:text-gray-700 font-mono">
                    Type: {diseaseType} • Severity: {severity} • Affected: {affectedPart}
                  </p>
                </div>
              )}

              {isHealthy && (
                <p className="text-emerald-400 print:text-emerald-800 font-bold">
                  No visible disease detected in this image.
                </p>
              )}
            </div>
          </div>

          {/* Section 5: Observed Symptoms */}
          {symptomsList.length > 0 && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100">
              <h4 className="font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wide mb-2">
                Observed Symptoms
              </h4>
              <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-1">
                {symptomsList.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 6: Evidence */}
          {(plantEvidence.length > 0 || diseaseEvidence.length > 0) && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100 space-y-2">
              <h4 className="font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wide">
                Pathology Evidence
              </h4>
              {plantEvidence.length > 0 && (
                <div>
                  <span className="text-gray-400 print:text-gray-600 font-semibold block text-[11px]">Plant Evidence:</span>
                  <p className="text-gray-200 print:text-gray-800">{plantEvidence.join(' • ')}</p>
                </div>
              )}
              {diseaseEvidence.length > 0 && (
                <div>
                  <span className="text-red-400 print:text-red-700 font-semibold block text-[11px]">Disease Evidence:</span>
                  <p className="text-gray-200 print:text-gray-800">{diseaseEvidence.join(' • ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Section 7: Possible Cause */}
          {possibleCause.explanation && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100 space-y-1">
              <h4 className="font-bold text-sky-400 print:text-sky-800 uppercase tracking-wide">
                Possible Cause ({possibleCause.category || 'General'})
              </h4>
              <p className="text-gray-200 print:text-gray-800 leading-relaxed">{possibleCause.explanation}</p>
            </div>
          )}

          {/* Section 8: Recommended Treatments */}
          {(immediateActions.length > 0 || biologicalOptions.length > 0 || chemicalOptions.length > 0) && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100 space-y-3">
              <h4 className="font-bold text-emerald-300 print:text-emerald-800 uppercase tracking-wide">
                Treatment Protocols
              </h4>

              {immediateActions.length > 0 && (
                <div>
                  <span className="text-amber-300 print:text-amber-800 font-bold block text-[11px]">Immediate Actions:</span>
                  <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-0.5">
                    {immediateActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {biologicalOptions.length > 0 && (
                <div>
                  <span className="text-emerald-400 print:text-emerald-700 font-bold block text-[11px]">Biological / Organic Options:</span>
                  <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-0.5">
                    {biologicalOptions.map((bio, idx) => (
                      <li key={idx}>{bio}</li>
                    ))}
                  </ul>
                </div>
              )}

              {chemicalOptions.length > 0 && (
                <div>
                  <span className="text-rose-400 print:text-rose-700 font-bold block text-[11px]">Chemical Options:</span>
                  <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-0.5">
                    {chemicalOptions.map((chem, idx) => (
                      <li key={idx}>{chem}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Section 9: Prevention Guidelines */}
          {preventionTips.length > 0 && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100">
              <h4 className="font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Prevention Strategies</span>
              </h4>
              <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-1">
                {preventionTips.map((prev, idx) => (
                  <li key={idx}>{prev}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 10: General Care */}
          {generalCareTips.length > 0 && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100">
              <h4 className="font-bold text-teal-400 print:text-teal-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                <span>General Care Guidelines</span>
              </h4>
              <ul className="list-disc list-inside text-gray-200 print:text-gray-800 space-y-1">
                {generalCareTips.map((care, idx) => (
                  <li key={idx}>{care}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 11: Final Summary */}
          {finalSummary && (
            <div className="bg-[#102015] border border-[#1f3f2a] p-3.5 rounded-xl text-xs print:bg-gray-100">
              <h4 className="font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Pathologist Final Summary</span>
              </h4>
              <p className="text-gray-200 print:text-gray-800 leading-relaxed font-medium">
                {finalSummary}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-[#1f3f2a] pt-3 text-[11px] text-gray-400 print:text-gray-600 text-center italic">
            <strong>Disclaimer:</strong> This AI plant pathology report is intended as an agricultural informational aid. Always follow certified agronomist instructions and pesticide product labels.
          </div>

        </div>

      </div>
    </div>
  );
}

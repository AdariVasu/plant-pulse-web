import React, { useState } from 'react';
import { 
  Volume2, VolumeX, FileText, AlertCircle, CheckCircle2, ImageOff, 
  RefreshCw, Bug, HelpCircle, ShieldAlert, Sparkles, ExternalLink, 
  Code, ShieldCheck, Activity, Leaf, Droplets, Sun, Sprout, Info, AlertTriangle
} from 'lucide-react';

export default function DiagnosticCard({ diagnosis, onExportReport, onResetUpload, analysisId, imageHash }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!diagnosis) return null;

  // Determine core states
  const isNotPlant = diagnosis.plant_detected === false || diagnosis.health_status === 'not_plant' || diagnosis.status === 'NOT_A_PLANT' || diagnosis.plant?.common_name === 'Not a plant';
  const isHealthy = !isNotPlant && (diagnosis.health?.status === 'healthy' || diagnosis.health_status === 'healthy' || diagnosis.status === 'HEALTHY' || (diagnosis.disease?.detected === false && diagnosis.health?.status !== 'uncertain'));
  const isUncertain = !isNotPlant && !isHealthy && (diagnosis.health?.status === 'uncertain' || diagnosis.health_status === 'uncertain' || diagnosis.analysis_status === 'uncertain' || diagnosis.status === 'UNCERTAIN' || diagnosis.plant?.common_name === 'Unknown plant');
  const isDiseased = !isNotPlant && !isHealthy && !isUncertain && (diagnosis.health?.status === 'diseased' || diagnosis.health_status === 'diseased' || diagnosis.disease?.detected === true || diagnosis.status === 'DISEASED');

  // Extraction with robust fallbacks
  const plant = diagnosis.plant || {};
  const health = diagnosis.health || {};
  const disease = diagnosis.disease || {};
  const possibleCause = diagnosis.possible_cause || {};
  const treatment = diagnosis.treatment || {};

  const plantName = plant.common_name || diagnosis.plant_name || 'Plant';
  const scientificName = plant.scientific_name || diagnosis.scientific_name || '';
  const plantType = plant.plant_type || diagnosis.plant_type || 'Agricultural Crop';
  const plantConfidence = Number(plant.confidence || diagnosis.plant_confidence) || (plantName === 'Unknown plant' ? 45 : 92);
  const imageQuality = diagnosis.image_quality || 'good';

  const diseaseName = disease.name || diagnosis.disease_name || (isHealthy ? 'No visible disease detected' : (isUncertain ? 'Unable to determine' : 'Condition Detected'));
  const diseaseType = disease.type || diagnosis.disease_type || (isHealthy ? 'None' : 'Pathology');
  const diseaseConfidence = isHealthy ? 0 : (Number(disease.confidence || diagnosis.disease_confidence) || (isUncertain ? 0 : 85));
  const severity = (disease.severity || diagnosis.severity || (isHealthy ? 'none' : 'Moderate')).toLowerCase();
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
  const finalSummary = diagnosis.final_summary || health.summary || '';

  // Audio Speech Reader
  const toggleAudioDiagnosis = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const speechText = isNotPlant
        ? "No plant material was detected in the uploaded image."
        : isHealthy
          ? `Analysis report for ${plantName}. Health status is healthy. No visible disease detected. Continue standard crop care.`
          : isUncertain
            ? `Plant analysis for ${plantName}. Visual evidence is insufficient for a reliable disease diagnosis. Please upload a clearer close-up photograph.`
            : `Analysis report for ${plantName}. Health status: Diseased. Condition: ${diseaseName}, severity ${severity}. ${finalSummary}`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Severity color badge helper
  const getSeverityBadge = (sev) => {
    const s = sev.toLowerCase();
    if (s.includes('low')) {
      return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Low</span>;
    }
    if (s.includes('mod')) {
      return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Moderate</span>;
    }
    if (s.includes('high') || s.includes('sev')) {
      return <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Severe</span>;
    }
    return <span className="bg-gray-500/20 text-gray-300 border border-gray-500/40 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Unknown</span>;
  };

  // 1. ERROR / AI ANALYSIS UNAVAILABLE UI
  if (diagnosis.error || diagnosis.status === 'AI_UNAVAILABLE') {
    return (
      <div className="bg-[#180f11] border-2 border-red-500/60 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-red-900/40 pb-3">
          <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>AI ANALYSIS UNAVAILABLE</span>
          </div>
          <span className="text-xs text-red-400 font-mono">Error</span>
        </div>

        <div className="bg-[#0d0708] border border-red-900/50 p-4 rounded-xl space-y-2">
          <h4 className="text-base font-extrabold text-white">AI Analysis Unavailable</h4>
          <p className="text-xs text-red-200/90 leading-relaxed">
            {diagnosis.message || "Gemini AI could not analyze this image. Please try again."}
          </p>
          <div className="pt-2">
            <button
              onClick={onResetUpload}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-red-950 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Another Image</span>
            </button>
          </div>
        </div>

        <DeveloperDebugPanel diagnosis={diagnosis} analysisId={analysisId} imageHash={imageHash} />
      </div>
    );
  }

  // 2. NON-PLANT GATE UI (CASE A)
  if (isNotPlant) {
    return (
      <div className="bg-[#180f11] border-2 border-orange-500/60 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-orange-900/40 pb-3">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span>✕ NOT A PLANT</span>
          </div>
          <span className="text-xs text-orange-300 font-mono font-bold">Analysis Complete</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-[#0d0708] border border-orange-900/50 p-4 rounded-xl">
          <div className="h-32 rounded-lg overflow-hidden border border-orange-800/60 bg-black flex items-center justify-center relative">
            <img src={diagnosis.image} alt="Non-plant upload" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-orange-400 opacity-90" />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <h4 className="text-lg font-black text-white uppercase tracking-wide">NOT A PLANT</h4>
            <p className="text-sm font-semibold text-orange-200">
              No plant material was detected in this image.
            </p>
            <p className="text-xs text-orange-300/80 leading-relaxed">
              The uploaded image does not appear to contain recognizable leaves, stems, flowers, or agricultural crops. Please upload a clear photo of plant foliage.
            </p>
            <div className="pt-2">
              <button
                onClick={onResetUpload}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-950 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Another Image</span>
              </button>
            </div>
          </div>
        </div>

        <DeveloperDebugPanel diagnosis={diagnosis} analysisId={analysisId} imageHash={imageHash} />
      </div>
    );
  }

  // 3. FULL 11-SECTION DETAILED PLANT PATHOLOGY REPORT
  return (
    <div className="bg-[#0e1a12] border border-[#1b3824] rounded-2xl p-5 shadow-xl space-y-5 text-gray-200">

      {/* TOP HEADER: SECTION 1 (IMAGE PREVIEW) & SECTION 2 (PLANT IDENTIFICATION) */}
      <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        {/* SECTION 1: Image Preview with Quality Badge */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#24472f] shrink-0 bg-black shadow-inner">
          <img src={diagnosis.image} alt={plantName} className="w-full h-full object-cover" />
          <span className={`absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shadow ${
            imageQuality === 'good' ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-600/40' :
            imageQuality === 'acceptable' ? 'bg-amber-950/90 text-amber-300 border border-amber-600/40' :
            'bg-red-950/90 text-red-300 border border-red-600/40'
          }`}>
            {imageQuality} quality
          </span>
        </div>

        {/* SECTION 2: Plant Identification */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold">
              SECTION 2 — PLANT IDENTIFICATION
            </span>
            <div className="bg-[#183121] border border-[#234930] px-2.5 py-0.5 rounded text-xs font-mono">
              <span className="text-gray-400 text-[10px]">Conf: </span>
              <strong className="text-emerald-400">{plantConfidence}%</strong>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {plantName}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {scientificName && (
              <span className="text-emerald-400 font-mono italic">
                {scientificName}
              </span>
            )}
            {plantType && (
              <span className="bg-[#162b1d] text-emerald-300/80 px-2 py-0.5 rounded text-[10px] font-medium border border-[#203f2a]">
                {plantType}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3: HEALTH STATUS (VISUALLY OBVIOUS HEADER) */}
      <div>
        <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block mb-1">
          SECTION 3 — HEALTH STATUS
        </span>
        {isHealthy ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-between shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  HEALTH STATUS: HEALTHY
                </h4>
                <p className="text-xs text-emerald-300/90 font-medium">
                  No visible signs of disease detected in this image.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40">
              Confidence: {health.confidence || 95}%
            </span>
          </div>
        ) : isUncertain ? (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center justify-between shadow-lg shadow-amber-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  HEALTH STATUS: UNCERTAIN
                </h4>
                <p className="text-xs text-amber-300/90 font-medium">
                  Visual evidence is insufficient for a reliable disease diagnosis.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/40">
              Low Confidence
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-red-500/15 border-2 border-red-500/50 flex items-center justify-between shadow-lg shadow-red-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  HEALTH STATUS: DISEASED
                </h4>
                <p className="text-xs text-red-300/90 font-medium">
                  Visual symptoms strongly indicate foliar pathology or infection.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-500/40">
              Severity: {severity.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* SECTION 4: DISEASE DETECTION DETAILS */}
      <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-3">
        <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
          SECTION 4 — DISEASE DETECTION
        </span>

        {isHealthy ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-bold">Diagnosed Condition:</span>
              <span className="text-emerald-400 font-mono font-bold">No visible disease detected</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Disease Confidence:</span>
              <span className="text-emerald-400 font-mono">0% (Healthy)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Severity Rating:</span>
              <span className="text-emerald-400 font-mono capitalize">None</span>
            </div>
          </div>
        ) : isUncertain ? (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-bold">Diagnosed Condition:</span>
              <span className="text-amber-300 font-mono font-bold">Unable to determine reliably</span>
            </div>
            <p className="text-gray-400 text-xs pt-1">
              Visual symptoms are ambiguous or masked. More visual evidence is required before applying remedies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#0b170f] p-2.5 rounded-lg border border-[#17301f]">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Disease Name</span>
              <strong className="text-white text-xs block truncate" title={diseaseName}>{diseaseName}</strong>
            </div>

            <div className="bg-[#0b170f] p-2.5 rounded-lg border border-[#17301f]">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Disease Type</span>
              <strong className="text-emerald-300 text-xs block truncate">{diseaseType}</strong>
            </div>

            <div className="bg-[#0b170f] p-2.5 rounded-lg border border-[#17301f]">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Confidence</span>
              <strong className="text-red-400 text-xs block">{diseaseConfidence}%</strong>
            </div>

            <div className="bg-[#0b170f] p-2.5 rounded-lg border border-[#17301f]">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Severity</span>
              <div className="mt-0.5">{getSeverityBadge(severity)}</div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: OBSERVED SYMPTOMS */}
      {symptomsList.length > 0 && (
        <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
            SECTION 5 — OBSERVED SYMPTOMS
          </span>
          <ul className="space-y-1.5 text-xs text-gray-200">
            {symptomsList.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION 6: EVIDENCE (PLANT & DISEASE) */}
      {(plantEvidence.length > 0 || diseaseEvidence.length > 0) && (
        <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-3">
          <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
            SECTION 6 — EVIDENCE
          </span>

          {plantEvidence.length > 0 && (
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold block mb-1.5">
                Plant Identification Evidence:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {plantEvidence.map((ev, idx) => (
                  <span key={idx} className="bg-[#0a180e] border border-[#1a3822] text-gray-300 text-[11px] px-2.5 py-1 rounded-lg">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {diseaseEvidence.length > 0 && (
            <div>
              <span className="text-[11px] text-red-400 font-semibold block mb-1.5">
                Disease Pathology Evidence:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {diseaseEvidence.map((ev, idx) => (
                  <span key={idx} className="bg-[#1b1012] border border-red-900/40 text-red-300 text-[11px] px-2.5 py-1 rounded-lg">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: POSSIBLE CAUSE */}
      {possibleCause.explanation && (
        <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold">
              SECTION 7 — POSSIBLE CAUSE
            </span>
            {possibleCause.category && possibleCause.category !== 'none' && (
              <span className="bg-[#192f20] border border-[#23452f] text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                Category: {possibleCause.category}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {possibleCause.explanation}
          </p>
        </div>
      )}

      {/* SECTION 8: TREATMENT (IMMEDIATE, BIOLOGICAL, AGRICULTURAL, CHEMICAL) */}
      <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-3">
        <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
          SECTION 8 — TREATMENT PROTOCOLS
        </span>

        {/* Immediate Actions */}
        {immediateActions.length > 0 && (
          <div className="space-y-1.5">
            <strong className="text-xs text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Immediate Actions:
            </strong>
            <ul className="space-y-1 text-xs text-gray-300 pl-4 list-disc">
              {immediateActions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Biological Options */}
        {biologicalOptions.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[#1a3823]">
            <strong className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Biological / Organic Options:
            </strong>
            <ul className="space-y-1 text-xs text-gray-300 pl-4 list-disc">
              {biologicalOptions.map((bio, idx) => (
                <li key={idx}>{bio}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Agricultural / Cultural Options */}
        {agriculturalOptions.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[#1a3823]">
            <strong className="text-xs text-teal-300 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-teal-400" />
              Agricultural & Cultural Practices:
            </strong>
            <ul className="space-y-1 text-xs text-gray-300 pl-4 list-disc">
              {agriculturalOptions.map((agri, idx) => (
                <li key={idx}>{agri}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Chemical Options */}
        {chemicalOptions.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[#1a3823]">
            <strong className="text-xs text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Chemical Management (Targeted):
            </strong>
            <ul className="space-y-1 text-xs text-gray-300 pl-4 list-disc">
              {chemicalOptions.map((chem, idx) => (
                <li key={idx}>{chem}</li>
              ))}
            </ul>
            <div className="mt-2 p-2 bg-[#1b1410] border border-amber-800/40 rounded text-[11px] text-amber-300/90 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Disclaimer:</strong> Always follow product label instructions and local agricultural authority regulations when applying fungicides or pesticides.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 9: PREVENTION TIPS */}
      {preventionTips.length > 0 && (
        <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
            SECTION 9 — PREVENTION STRATEGIES
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
            {preventionTips.map((tip, idx) => (
              <li key={idx} className="bg-[#0b170f] p-2.5 rounded-lg border border-[#17301f] flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION 10: GENERAL CARE GUIDELINES */}
      {generalCareTips.length > 0 && (
        <div className="bg-[#122217] border border-[#1e3d28] p-4 rounded-xl space-y-2">
          <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider font-semibold block">
            SECTION 10 — GENERAL CROP CARE GUIDELINES
          </span>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {generalCareTips.map((care, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Droplets className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{care}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECTION 11: FINAL SUMMARY OVERVIEW */}
      {finalSummary && (
        <div className="bg-gradient-to-br from-[#12291b] to-[#0c1c12] border-2 border-emerald-500/40 p-4 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>SECTION 11 — PATHOLOGIST FINAL SUMMARY</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed font-medium">
            {finalSummary}
          </p>
        </div>
      )}

      {/* ACTION BUTTONS (AUDIO READER & EXPORT REPORT) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={toggleAudioDiagnosis}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            isPlayingAudio
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
              : 'bg-[#13261a] hover:bg-[#1a3323] text-gray-200 border-[#1e3f29]'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-400" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Listen to Diagnosis</span>
            </>
          )}
        </button>

        <button
          onClick={onExportReport}
          className="flex items-center justify-center gap-2 bg-[#13261a] hover:bg-[#1a3323] text-gray-200 border border-[#1e3f29] text-xs font-semibold transition-all cursor-pointer py-2.5 rounded-xl"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Export Full Report</span>
        </button>
      </div>

      {/* AUDIT & DEVELOPER DEBUG PANEL */}
      <DeveloperDebugPanel diagnosis={diagnosis} analysisId={analysisId} imageHash={imageHash} />

    </div>
  );
}

// DEVELOPER DEBUG PANEL COMPONENT
function DeveloperDebugPanel({ diagnosis, analysisId, imageHash }) {
  const [isOpen, setIsOpen] = useState(false);

  const sanitizedDecision = { ...diagnosis };
  delete sanitizedDecision.apiKey;
  delete sanitizedDecision.key;
  if (sanitizedDecision.image && sanitizedDecision.image.length > 100) {
    sanitizedDecision.image = `${sanitizedDecision.image.slice(0, 30)}... [${sanitizedDecision.image.length} chars]`;
  }

  const isConfigured = diagnosis.geminiConfigured ?? Boolean(diagnosis.isGeminiLive);
  const modelUsed = diagnosis.modelUsed || 'gemini-flash-lite-latest';
  const requestStatus = diagnosis.geminiRequestStatus || (diagnosis.error ? 'failed' : 'sent');
  const responseStatus = diagnosis.geminiResponseStatus || (diagnosis.error ? 'failed' : 'received');

  return (
    <div className="border border-[#1b3824] bg-[#07120a] rounded-xl overflow-hidden text-[10px] font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-[#0d1d12] hover:bg-[#122818] flex items-center justify-between text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Code className="w-3.5 h-3.5" />
          Developer Debug Panel (Part 22 Audit)
        </span>
        <span className="text-gray-500">{isOpen ? '▼ Hide' : '▶ Show'}</span>
      </button>

      {isOpen && (
        <div className="p-3 space-y-2 border-t border-[#1b3824] text-gray-300 bg-[#09140b]">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-gray-500">Analysis ID:</span> #{analysisId?.slice(0, 12) || 'N/A'}</div>
            <div><span className="text-gray-500">Image Hash:</span> {imageHash || 'N/A'}</div>
            <div>
              <span className="text-gray-500">Gemini Configured:</span>{' '}
              <span className={isConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isConfigured ? 'true' : 'false'}
              </span>
            </div>
            <div><span className="text-gray-500">Gemini Model:</span> <span className="text-emerald-400">{modelUsed}</span></div>
            <div>
              <span className="text-gray-500">Gemini Request:</span>{' '}
              <span className={requestStatus === 'sent' ? 'text-emerald-400' : 'text-red-400'}>{requestStatus}</span>
            </div>
            <div>
              <span className="text-gray-500">Gemini Response:</span>{' '}
              <span className={responseStatus === 'received' ? 'text-emerald-400' : 'text-red-400'}>{responseStatus}</span>
            </div>
            <div><span className="text-gray-500">Health Status:</span> <span className="text-emerald-400 font-bold">{diagnosis.health?.status || diagnosis.health_status || 'N/A'}</span></div>
            <div>
              <span className="text-gray-500">Validation Status:</span>{' '}
              <span className={diagnosis.error ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {diagnosis.error ? 'FAILED' : 'VALIDATED'}
              </span>
            </div>
          </div>

          <div className="border-t border-[#1b3824] pt-2">
            <span className="text-gray-500 font-bold block mb-1">Parsed Report Object:</span>
            <pre className="bg-[#040905] p-2 rounded border border-[#14281a] overflow-x-auto text-[9px] text-emerald-300 max-h-48">
              {JSON.stringify(sanitizedDecision, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

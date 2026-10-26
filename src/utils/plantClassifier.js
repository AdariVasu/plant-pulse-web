import { PLANT_DISEASES_DATABASE } from '../data/plantDatabase';

/**
 * PlantPulse Image Helper & Helper Utilities
 * Preset sample crop mapping with complete 4-section disease management protocols.
 */

export function getPresetSampleDiagnosis(sampleId, imageDataUrl) {
  const preset = PLANT_DISEASES_DATABASE.find(d => d.id === sampleId || d.image === imageDataUrl);
  if (!preset) return null;

  const isHealthy = preset.status === 'HEALTHY';
  return {
    isPlant: true,
    status: isHealthy ? "HEALTHY" : "DISEASED",
    isSamplePreset: true,
    plant: {
      commonName: preset.cropName.replace(' Crop', '').replace(' Orchard', '').replace(' Vineyard', ''),
      scientificName: preset.botanicalName,
      confidence: preset.confidence || 96
    },
    disease: isHealthy ? null : {
      name: preset.diseaseName.split(' (')[0],
      scientificName: preset.diseaseName.includes('(') ? preset.diseaseName.split('(')[1].replace(')', '') : null,
      confidence: preset.confidence || 94
    },
    diseaseConfidence: isHealthy ? 0 : (preset.confidence || 94),
    severity: isHealthy ? "NONE" : (preset.severity?.toUpperCase() || "MEDIUM"),
    symptoms: isHealthy ? [] : (preset.symptoms || []),
    cause: isHealthy ? null : `Pathogen (${preset.botanicalName})`,
    treatment: {
      immediate: preset.immediateAction || [],
      organic: preset.organicFixes || [],
      chemical: preset.chemicalRemedies || []
    },
    immediateAction: preset.immediateAction || [],
    organicFixes: preset.organicFixes || [],
    chemicalRemedies: preset.chemicalRemedies || [],
    prevention: preset.prevention || [],
    explanation: isHealthy ? "The plant foliage appears healthy with no significant visible disease lesions." : `Observed symptoms are consistent with ${preset.diseaseName}.`,
    image: imageDataUrl,
    wikipedia: preset.wikipedia,
    weatherRisk: preset.weatherRisk
  };
}

/**
 * Helper to calculate a quick non-sensitive hash of the image data URL for debug verification
 */
export function calculateImageHash(dataUrl) {
  if (!dataUrl) return 'N/A';
  let hash = 0;
  for (let i = 0; i < Math.min(dataUrl.length, 1000); i++) {
    const char = dataUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'IMG-' + Math.abs(hash).toString(16).toUpperCase();
}

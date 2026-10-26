/**
 * PlantPulse.AI — Official Google Gemini Vision Engine & Validation
 * Connects React frontend directly to Express backend (/api/analyze)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Application-Side Validation
 * Enforces strict consistency rules on raw AI responses.
 */
export function validateAnalysisResult(rawResult) {
  // Support either rawResult directly or rawResult.analysis wrapper
  const result = rawResult?.analysis || rawResult || {};

  // STEP 1: Image Quality check
  const imageQuality = result.image_quality === 'poor' ? 'poor' : (result.image_quality === 'acceptable' ? 'acceptable' : 'good');
  if (imageQuality === 'poor') {
    return {
      analysis_status: "uncertain",
      plant_detected: Boolean(result.plant_detected),
      image_quality: "poor",
      plant: {
        common_name: result.plant?.common_name || result.plant_name || "Unknown plant",
        scientific_name: result.plant?.scientific_name || result.scientific_name || "",
        plant_type: result.plant?.plant_type || "Plant",
        confidence: Number(result.plant?.confidence || result.plant_confidence) || 30
      },
      health: {
        status: "uncertain",
        confidence: 20,
        summary: "The image quality is not sufficient for reliable plant health analysis."
      },
      disease: {
        detected: false,
        name: "None",
        type: "None",
        confidence: 0,
        severity: "unknown",
        affected_part: ""
      },
      symptoms: result.symptoms?.length > 0 ? result.symptoms : ["Image is blurry, underexposed, or obstructed."],
      possible_cause: {
        category: "unknown",
        explanation: "Cause cannot be confirmed from the image alone due to poor photo quality."
      },
      plant_identification_evidence: result.plant_identification_evidence || [],
      disease_evidence: [],
      treatment: {
        immediate_actions: ["Capture a clearer photo in good natural lighting."],
        biological_options: [],
        agricultural_options: [],
        chemical_options: []
      },
      prevention: ["Inspect leaves under direct daylight and take focused close-up shots."],
      general_care: ["Maintain standard watering until a clear diagnostic image is obtained."],
      final_summary: "The image quality is not sufficient for reliable plant health analysis. Please upload a clearer close-up photograph of the leaf foliage.",
      
      // Flat backward-compatibility properties:
      plant_name: result.plant?.common_name || result.plant_name || "Unknown plant",
      scientific_name: result.plant?.scientific_name || result.scientific_name || "",
      plant_confidence: Number(result.plant?.confidence || result.plant_confidence) || 30,
      health_status: "uncertain",
      disease_name: "Unable to determine",
      disease_confidence: 0,
      severity: "unknown",
      recommended_solution: ["Upload a clearer close-up photograph of the leaf foliage in natural lighting."]
    };
  }

  // STEP 2: Non-Plant Gate
  const isNotPlant = (
    result.plant_detected === false ||
    result.health_status === 'not_plant' ||
    result.health?.status === 'not_plant' ||
    result.plant_name === 'Not a plant' ||
    result.plant?.common_name === 'Not a plant' ||
    result.status === 'NOT_A_PLANT'
  );

  if (isNotPlant) {
    return {
      analysis_status: "complete",
      plant_detected: false,
      image_quality: imageQuality,
      plant: {
        common_name: "Not a plant",
        scientific_name: "",
        plant_type: "",
        confidence: 100
      },
      health: {
        status: "uncertain",
        confidence: 100,
        summary: "The uploaded image does not contain identifiable plant material."
      },
      disease: {
        detected: false,
        name: "None",
        type: "None",
        confidence: 0,
        severity: "none",
        affected_part: ""
      },
      symptoms: [],
      possible_cause: {
        category: "none",
        explanation: "No plant material detected in the uploaded image."
      },
      plant_identification_evidence: [],
      disease_evidence: [],
      treatment: {
        immediate_actions: [],
        biological_options: [],
        agricultural_options: [],
        chemical_options: []
      },
      prevention: [],
      general_care: [],
      final_summary: "No plant material was detected in this image. Please upload a clear photo of a plant leaf, stem, flower, fruit, or crop.",
      
      // Flat backward-compatibility:
      plant_name: "Not a plant",
      scientific_name: "",
      plant_confidence: 0,
      health_status: "uncertain",
      disease_name: "None",
      disease_confidence: 0,
      severity: "none",
      recommended_solution: []
    };
  }

  // STEP 3: Identify Plant
  const rawPlant = result.plant || {};
  let plantName = (rawPlant.common_name || result.plant_name || '').trim();
  if (!plantName || plantName.toLowerCase() === 'plant') {
    plantName = "Unknown plant";
  }
  const scientificName = (rawPlant.scientific_name || result.scientific_name || '').trim();
  const plantType = (rawPlant.plant_type || result.plant_type || 'Agricultural Crop').trim();
  const plantConfidence = Number(rawPlant.confidence || result.plant_confidence) || (plantName === "Unknown plant" ? 45 : 92);

  // STEP 4: Health Status
  const rawHealth = result.health || {};
  const rawDisease = result.disease || {};
  const healthStatusLower = (rawHealth.status || result.health_status || '').toLowerCase();
  const diseaseNameLower = (rawDisease.name || result.disease_name || '').toLowerCase();

  const isHealthy = (
    healthStatusLower === 'healthy' ||
    rawHealth.status === 'HEALTHY' ||
    diseaseNameLower === 'none' ||
    diseaseNameLower === 'healthy' ||
    diseaseNameLower.includes('no disease') ||
    diseaseNameLower.includes('no visible disease') ||
    rawDisease.detected === false
  );

  const isDiseased = !isHealthy && (
    healthStatusLower === 'diseased' ||
    rawHealth.status === 'DISEASED' ||
    rawDisease.detected === true ||
    (result.disease_name && result.disease_name !== 'None' && result.disease_name !== 'Unable to determine')
  );

  // Helper to extract or fallback arrays
  const plantIdEvidence = Array.isArray(result.plant_identification_evidence) && result.plant_identification_evidence.length > 0
    ? result.plant_identification_evidence
    : ["Foliage morphology and leaf blade structure", "Venation arrangement"];

  const rawSymptoms = Array.isArray(result.symptoms) && result.symptoms.length > 0 ? result.symptoms : [];
  const rawTreat = result.treatment || {};
  const immediateActions = Array.isArray(rawTreat.immediate_actions) && rawTreat.immediate_actions.length > 0
    ? rawTreat.immediate_actions
    : (Array.isArray(result.recommended_solution) ? result.recommended_solution.slice(0, 2) : []);
  const biologicalOptions = Array.isArray(rawTreat.biological_options) ? rawTreat.biological_options : [];
  const agriculturalOptions = Array.isArray(rawTreat.agricultural_options) ? rawTreat.agricultural_options : [];
  const chemicalOptions = Array.isArray(rawTreat.chemical_options) ? rawTreat.chemical_options : [];
  const preventionTips = Array.isArray(result.prevention) && result.prevention.length > 0 ? result.prevention : [];
  const generalCareTips = Array.isArray(result.general_care) && result.general_care.length > 0 ? result.general_care : [];

  // STEP 6: IF HEALTHY
  if (isHealthy) {
    const symptomsList = rawSymptoms.length > 0 ? rawSymptoms : [
      "Normal leaf color and healthy chlorophyll distribution",
      "Normal intact foliage structure without chlorosis or necrosis",
      "No obvious fungal spots, mycelial growth, or pest lesions"
    ];
    const careList = generalCareTips.length > 0 ? generalCareTips : [
      "Maintain consistent soil moisture without waterlogging",
      "Ensure adequate direct or diffused sunlight according to crop requirement",
      "Apply balanced organic fertilizer during active vegetative growth",
      "Inspect undersides of leaves weekly for early signs of pests or disease"
    ];
    const immediateList = immediateActions.length > 0 ? immediateActions : [
      "Continue standard routine watering and monitoring",
      "Avoid overhead watering late in the evening to prevent fungal incubation"
    ];
    const preventList = preventionTips.length > 0 ? preventionTips : [
      "Maintain adequate spacing between plants for good airflow",
      "Clean garden tools between uses to avoid pathogen transmission",
      "Ensure proper root drainage to prevent root rot"
    ];

    return {
      analysis_status: "complete",
      plant_detected: true,
      image_quality: imageQuality,
      plant: {
        common_name: plantName,
        scientific_name: scientificName,
        plant_type: plantType,
        confidence: plantConfidence
      },
      health: {
        status: "healthy",
        confidence: Number(rawHealth.confidence) || 94,
        summary: "No visible signs of disease were detected in this image."
      },
      disease: {
        detected: false,
        name: "No visible disease detected",
        type: "None",
        confidence: 0,
        severity: "none",
        affected_part: rawDisease.affected_part || "Foliage"
      },
      symptoms: symptomsList,
      possible_cause: {
        category: "none",
        explanation: "The plant exhibits healthy cellular morphology with no visible pathogen damage."
      },
      plant_identification_evidence: plantIdEvidence,
      disease_evidence: [],
      treatment: {
        immediate_actions: immediateList,
        biological_options: biologicalOptions,
        agricultural_options: agriculturalOptions.length > 0 ? agriculturalOptions : ["Ensure optimal aeration and good soil drainage."],
        chemical_options: [] // strictly no chemicals for healthy plant
      },
      prevention: preventList,
      general_care: careList,
      final_summary: result.final_summary || `The ${plantName} foliage appears healthy with vibrant color and intact tissue. No visible signs of disease were detected in this image. Continue standard watering and monitoring.`,

      // Flat compatibility properties
      plant_name: plantName,
      scientific_name: scientificName,
      plant_type: plantType,
      plant_confidence: plantConfidence,
      health_status: "healthy",
      disease_name: "No visible disease detected",
      disease_confidence: 0,
      severity: "none",
      affected_part: "Foliage",
      recommended_solution: careList
    };
  }

  // STEP 7: IF DISEASED
  if (isDiseased) {
    const diseaseName = (rawDisease.name || result.disease_name || "Foliage Pathology Detected").trim();
    const diseaseType = (rawDisease.type || result.disease_type || "Fungal disease").trim();
    const diseaseConfidence = Number(rawDisease.confidence || result.disease_confidence) || 88;
    const severityRaw = (rawDisease.severity || result.severity || "Moderate").toLowerCase();
    const severityNorm = severityRaw.includes('low') ? 'Low' : (severityRaw.includes('sev') ? 'Severe' : (severityRaw.includes('hi') ? 'High' : 'Moderate'));
    const affectedPart = rawDisease.affected_part || result.affected_part || "Leaf foliage";

    const symptomsList = rawSymptoms.length > 0 ? rawSymptoms : [
      `Localized discoloration and lesions on ${affectedPart}`,
      "Chlorotic yellowing surrounding affected leaf margins"
    ];
    const diseaseEvidence = Array.isArray(result.disease_evidence) && result.disease_evidence.length > 0
      ? result.disease_evidence
      : symptomsList.slice(0, 2);

    const causeCategory = result.possible_cause?.category || (diseaseType.toLowerCase().includes('fung') ? 'fungal' : (diseaseType.toLowerCase().includes('bact') ? 'bacterial' : (diseaseType.toLowerCase().includes('vir') ? 'viral' : 'unknown')));
    const causeExplanation = result.possible_cause?.explanation || `Observed leaf spots and tissue discoloration are consistent with a ${causeCategory} infection.`;

    const immediateList = immediateActions.length > 0 ? immediateActions : [
      "Prune and discard severely infected foliage to prevent spore spread",
      "Avoid overhead watering to keep leaf surfaces dry",
      "Isolate affected container plants from healthy specimens"
    ];
    const bioList = biologicalOptions.length > 0 ? biologicalOptions : [
      "Apply organic cold-pressed neem oil spray (3-5ml/L) as a natural bio-fungicide",
      "Inoculate root zone with beneficial bio-agents (Trichoderma viride or Bacillus subtilis)"
    ];
    const agriList = agriculturalOptions.length > 0 ? agriculturalOptions : [
      "Improve air circulation through selective pruning and adequate spacing",
      "Ensure proper soil drainage to avoid waterlogged root systems"
    ];
    const chemList = chemicalOptions.length > 0 ? chemicalOptions : [
      "If disease progresses, apply an approved broad-spectrum or copper-based fungicide strictly following product label directions and local agricultural guidance."
    ];
    const preventList = preventionTips.length > 0 ? preventionTips : [
      "Maintain adequate plant spacing for optimal canopy aeration",
      "Always water at the base of the plant using drip irrigation",
      "Sanitize pruning shears with 70% alcohol between cuts",
      "Remove and destroy fallen leaf debris at the end of the season"
    ];
    const careList = generalCareTips.length > 0 ? generalCareTips : [
      "Monitor healthy leaves daily for new lesions",
      "Maintain balanced nutrition without excessive nitrogen which softens leaf tissue"
    ];

    return {
      analysis_status: "complete",
      plant_detected: true,
      image_quality: imageQuality,
      plant: {
        common_name: plantName,
        scientific_name: scientificName,
        plant_type: plantType,
        confidence: plantConfidence
      },
      health: {
        status: "diseased",
        confidence: diseaseConfidence,
        summary: result.health?.summary || `${diseaseName} identified with ${diseaseConfidence}% confidence affecting ${affectedPart}.`
      },
      disease: {
        detected: true,
        name: diseaseName,
        type: diseaseType,
        confidence: diseaseConfidence,
        severity: severityNorm,
        affected_part: affectedPart
      },
      symptoms: symptomsList,
      possible_cause: {
        category: causeCategory,
        explanation: causeExplanation
      },
      plant_identification_evidence: plantIdEvidence,
      disease_evidence: diseaseEvidence,
      treatment: {
        immediate_actions: immediateList,
        biological_options: bioList,
        agricultural_options: agriList,
        chemical_options: chemList
      },
      prevention: preventList,
      general_care: careList,
      final_summary: result.final_summary || `${plantName} shows visible signs of ${diseaseName} at ${severityNorm} severity. Immediate pruning of affected leaves and targeted antifungal/cultural measures are recommended.`,

      // Flat compatibility properties
      plant_name: plantName,
      scientific_name: scientificName,
      plant_type: plantType,
      plant_confidence: plantConfidence,
      health_status: "diseased",
      disease_name: diseaseName,
      disease_confidence: diseaseConfidence,
      severity: severityNorm,
      affected_part: affectedPart,
      recommended_solution: [...immediateList, ...bioList, ...chemList]
    };
  }

  // STEP 8: IF UNCERTAIN
  return {
    analysis_status: "uncertain",
    plant_detected: true,
    image_quality: imageQuality,
    plant: {
      common_name: plantName,
      scientific_name: scientificName,
      plant_type: plantType,
      confidence: plantConfidence
    },
    health: {
      status: "uncertain",
      confidence: 40,
      summary: "Plant material is visible, but the available image does not provide enough evidence for a reliable disease diagnosis."
    },
    disease: {
      detected: false,
      name: "Unable to determine",
      type: "Unknown",
      confidence: 0,
      severity: "Unknown",
      affected_part: "Foliage"
    },
    symptoms: rawSymptoms.length > 0 ? rawSymptoms : ["Visual evidence is ambiguous for a definitive disease diagnosis."],
    possible_cause: {
      category: "unknown",
      explanation: "Cause cannot be confirmed from the image alone."
    },
    plant_identification_evidence: plantIdEvidence,
    disease_evidence: [],
    treatment: {
      immediate_actions: ["Capture a clearer close-up photograph of the leaf in daylight."],
      biological_options: [],
      agricultural_options: ["Ensure standard crop watering and sunlight."],
      chemical_options: []
    },
    prevention: ["Monitor the plant closely for developing symptoms over the next 48-72 hours."],
    general_care: ["Avoid unnecessary pesticide application until diagnosis is confirmed."],
    final_summary: result.final_summary || `Plant material is visible, but the available image does not provide enough evidence for a reliable disease diagnosis. Please upload a clearer close-up photo under natural lighting.`,

    // Flat compatibility properties
    plant_name: plantName,
    scientific_name: scientificName,
    plant_type: plantType,
    plant_confidence: plantConfidence,
    health_status: "uncertain",
    disease_name: "Unable to determine",
    disease_confidence: 0,
    severity: "Unknown",
    affected_part: "Foliage",
    recommended_solution: ["Upload a clearer close-up photograph of the leaf foliage in natural lighting."]
  };
}

/**
 * Fetch with strict timeout using AbortController
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      const abortError = new Error(`Request timed out after ${timeoutMs / 1000}s`);
      abortError.name = 'TimeoutError';
      throw abortError;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Descriptive Error Classifier (Section 11)
 */
export function classifyErrorMessage(status, backendMessage) {
  if (status === 'offline') return "Backend connection failed";
  if (status === 'missing_key') return "Gemini API is not configured";
  if (status === 'authentication_error') return "Gemini authentication failed";
  if (status === 'quota_exceeded' || (backendMessage && backendMessage.toLowerCase().includes('quota'))) return "Gemini quota exceeded";
  if (status === 'network_error') return "Cannot connect to analysis server";
  return backendMessage || "Plant analysis failed";
}

/**
 * Check general backend health (GET /health with fallback to /api/health)
 * Strict 10-second timeout.
 */
export async function checkBackendHealth(timeoutMs = 10000) {
  try {
    let response = await fetchWithTimeout(`${API_BASE_URL}/health`, { method: "GET" }, timeoutMs).catch(() => null);
    if (!response || !response.ok) {
      response = await fetchWithTimeout(`${API_BASE_URL}/api/health`, { method: "GET" }, timeoutMs).catch(() => null);
    }
    if (response && response.ok) {
      const data = await response.json().catch(() => null);
      return data || { success: true, status: 'running' };
    }
    return { success: false, status: 'offline', message: 'Backend connection failed' };
  } catch (e) {
    return { success: false, status: 'offline', message: 'Backend connection failed' };
  }
}

/**
 * Check backend Gemini configuration status (GET /api/gemini/health)
 */
export async function checkServerHealth(timeoutMs = 10000) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/gemini/health`, { method: "GET" }, timeoutMs);
    if (response.ok) {
      return await response.json();
    }
    return { configured: false, status: 'api_error', message: 'Gemini health check error.' };
  } catch (e) {
    return { configured: false, status: 'offline', message: 'Backend connection failed' };
  }
}

/**
 * Test Gemini API connection (GET or POST /api/gemini/test)
 * Strict 10-second timeout.
 */
export async function testGeminiConnection(apiKey = "", timeoutMs = 10000) {
  try {
    const isPost = Boolean(apiKey && apiKey.trim());
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/gemini/test`,
      {
        method: isPost ? "POST" : "GET",
        headers: isPost ? { "Content-Type": "application/json" } : {},
        body: isPost ? JSON.stringify({ apiKey: apiKey.trim() }) : undefined
      },
      timeoutMs
    );
    const data = await response.json().catch(() => null);
    if (response.ok && data) {
      return {
        ...data,
        connected: data.success === true || data.status === 'ready'
      };
    }
    const safeError = data?.error || (response.status >= 500 ? "Analysis server returned an error" : "Gemini connection failed");
    return {
      success: false,
      connected: false,
      status: data?.status || 'api_error',
      error: safeError
    };
  } catch (err) {
    console.warn("testGeminiConnection error:", err.message);
    return {
      success: false,
      connected: false,
      status: 'offline',
      error: 'Backend connection failed'
    };
  }
}

/**
 * Save API key securely to the backend session & persistent .env (POST /api/save-key)
 */
export async function saveServerApiKey(apiKey, timeoutMs = 10000) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/save-key`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey })
      },
      timeoutMs
    );
    return await response.json();
  } catch (err) {
    console.error("saveServerApiKey error:", err);
    return { success: false, status: 'offline', message: 'Backend connection failed' };
  }
}

/**
 * Main Vision Analysis Function
 * Sends image as multipart/form-data to POST /api/analyze
 */
export async function analyzeImageWithGemini(imageDataUrl, apiKey = "") {
  try {
    const formData = new FormData();

    if (imageDataUrl instanceof File || imageDataUrl instanceof Blob) {
      formData.append("image", imageDataUrl);
    } else if (typeof imageDataUrl === 'string' && imageDataUrl.startsWith('data:')) {
      const parts = imageDataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });
      formData.append("image", blob, "uploaded_plant.jpg");
    } else {
      formData.append("image", imageDataUrl);
    }

    if (apiKey) {
      formData.append("apiKey", apiKey);
    }

    console.log("[Vision Client] Sending FormData POST /api/analyze request...");

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData
    }, 25000);

    const data = await response.json().catch(() => null);

    if (response.ok && data && (data.plant_detected !== undefined || data.analysis?.plant_detected !== undefined) && !data.error) {
      console.log("[Vision Client] Backend Response Received:", data);
      
      const validated = validateAnalysisResult(data);
      return {
        ...validated,
        aiSuccess: true,
        isGeminiLive: true,
        geminiConfigured: true,
        geminiRequestStatus: "sent",
        geminiResponseStatus: "received",
        modelUsed: data.modelUsed || "gemini-3.6-flash",
        googleSearchStatus: data.googleSearchStatus || "SKIPPED"
      };
    }

    const errorStatus = data?.status || (response.status === 429 ? 'quota_exceeded' : 'api_error');
    const safeMsg = classifyErrorMessage(errorStatus, data?.error || data?.message);

    console.warn("[Vision Client] Backend returned error:", errorStatus, safeMsg);
    return {
      error: true,
      status: errorStatus,
      message: safeMsg,
      geminiConfigured: errorStatus !== 'missing_key',
      geminiRequestStatus: "sent",
      geminiResponseStatus: "failed",
      modelUsed: data?.modelUsed || "gemini-3.6-flash"
    };

  } catch (err) {
    console.error("[Vision Client] Network error contacting backend:", err);
    return {
      error: true,
      status: 'offline',
      message: "Backend connection failed",
      geminiConfigured: false,
      geminiRequestStatus: "failed",
      geminiResponseStatus: "failed",
      modelUsed: "gemini-3.6-flash"
    };
  }
}

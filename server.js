import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 5000;

// Section 11 & 14: CORS configuration explicitly allowing frontend at port 9091
app.use(cors({
  origin: ['http://localhost:9091', 'http://127.0.0.1:9091', 'http://localhost:9092'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));

// Section 6: Multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

const configuredModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

const SUPPORTED_GEMINI_MODELS = [
  configuredModel,
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite-preview',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash'
].filter((m, i, arr) => m && arr.indexOf(m) === i);

let activeWorkingModel = configuredModel;
let cachedGeminiHealth = null;
let lastHealthCheckTime = 0;

/**
 * Section 4 & 5: Retrieve active API key safely
 */
function getActiveApiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
}

/**
 * Persist an environment key/value to the .env file on disk
 */
function persistEnvKey(key, value) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
    }
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += (content.endsWith('\n') ? '' : '\n') + `${key}=${value}\n`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (err) {
    console.warn('[Server] Failed to write to .env:', err.message);
  }
}

/**
 * Categorize error into standard status codes and safe messages
 */
function categorizeGoogleError(err) {
  const msg = err?.message || '';
  const status = err?.status || err?.code;
  if (
    msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') ||
    msg.includes('UNAUTHENTICATED') ||
    msg.includes('OAuth 2') ||
    msg.includes('API_KEY_INVALID') ||
    msg.includes('API key not valid') ||
    status === 401 ||
    status === 403
  ) {
    return {
      status: 'authentication_error',
      statusCode: 401,
      message: 'Gemini authentication failed. Please verify your API key in Google AI Studio.'
    };
  }
  if (msg.includes('QUOTA') || status === 429 || msg.includes('ResourceHasBeenExhausted')) {
    return {
      status: 'api_error',
      statusCode: 429,
      message: 'Gemini API quota was exceeded.'
    };
  }
  if (status === 503 || msg.includes('high demand') || msg.includes('temporarily unavailable')) {
    return {
      status: 'api_error',
      statusCode: 503,
      message: 'Gemini service is currently experiencing high demand. Please try again shortly.'
    };
  }
  if (status === 404 || msg.includes('NOT_FOUND') || msg.includes('not found')) {
    return {
      status: 'api_error',
      statusCode: 404,
      message: 'Configured Gemini model was not found or is unavailable.'
    };
  }
  return {
    status: 'api_error',
    statusCode: 502,
    message: 'Gemini API is temporarily unavailable.'
  };
}

/**
 * Section 9: Strict Validation function
 */
export function validateAnalysisResult(raw) {
  const result = raw?.analysis || raw || {};

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
 * Section 3 & 4: Verify Gemini client initialization
 */
async function verifyGeminiConnection(keyToTest) {
  const apiKey = (keyToTest || getActiveApiKey()).trim();
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      connected: false,
      provider: "Google Gemini",
      status: 'missing_key',
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in .env or configure it in Settings.'
    };
  }

  let lastCategorized = null;

  for (const modelName of SUPPORTED_GEMINI_MODELS) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: 'Respond with OK'
      });

      if (response && response.text) {
        activeWorkingModel = modelName;
        return {
          success: true,
          configured: true,
          connected: true,
          provider: "Google Gemini",
          message: "Gemini connection successful",
          status: 'ready',
          model: modelName
        };
      }
    } catch (err) {
      lastCategorized = categorizeGoogleError(err);
      if (lastCategorized.status === 'authentication_error') {
        break;
      }
    }
  }

  return {
    success: false,
    configured: true,
    connected: false,
    provider: "Google Gemini",
    status: lastCategorized?.status || 'api_error',
    error: lastCategorized?.message || 'Gemini API is temporarily unavailable.'
  };
}

// Friendly root route when user opens http://localhost:5000 in browser or makes GET /
app.get('/', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(200).json({
      name: "PlantPulse.AI Backend Server",
      status: "running",
      port: PORT,
      frontendUrl: "http://localhost:9091",
      endpoints: {
        health: "/api/health",
        geminiHealth: "/api/gemini/health",
        geminiTest: "/api/gemini/test",
        analyze: "POST /api/analyze"
      }
    });
  }

  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PlantPulse.AI — Backend Server</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #09120b;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #0e1a12;
      border: 1px solid #1b3824;
      border-radius: 16px;
      max-width: 520px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
    }
    h1 {
      margin: 0 0 8px 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 900;
    }
    h1 span { color: #34d399; }
    p {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .btn {
      display: inline-block;
      background: #10b981;
      color: #041007;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 10px;
      transition: background 0.2s;
    }
    .btn:hover { background: #34d399; }
    .endpoints {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #1a3323;
      font-family: monospace;
      font-size: 12px;
      color: #a7f3d0;
    }
    .endpoints div { margin: 6px 0; }
    a { color: #34d399; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Backend Online &amp; Running</div>
    <h1>PlantPulse<span>.AI</span> Backend Server</h1>
    <p>The Express analysis server is running on port 5000 and connected to Google Gemini AI Vision. The interactive frontend application is hosted on port 9091.</p>
    <a href="http://localhost:9091" class="btn">Open PlantPulse App (Port 9091) &rarr;</a>
    <div class="endpoints">
      <div><strong>Active REST Endpoints:</strong></div>
      <div>&bull; <a href="/api/health">GET /api/health</a> &mdash; System Health</div>
      <div>&bull; <a href="/api/gemini/health">GET /api/gemini/health</a> &mdash; Config Status</div>
      <div>&bull; <a href="/api/gemini/test">GET /api/gemini/test</a> &mdash; Test Gemini Live</div>
      <div>&bull; POST /api/analyze &mdash; Vision Disease Diagnosis</div>
    </div>
  </div>
</body>
</html>`);
});

// Section 2: GET /api/health — General Backend Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'PlantPulse backend',
    status: 'running'
  });
});

// Section 3: GET /api/gemini/health — Gemini Configuration Check
app.get('/api/gemini/health', async (req, res) => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    return res.status(200).json({
      configured: false,
      provider: "Google Gemini"
    });
  }
  return res.status(200).json({
    configured: true,
    provider: "Google Gemini"
  });
});

// Section 5 & 7: GET /api/gemini/test and POST /api/gemini/test — Real Gemini Test
app.all('/api/gemini/test', async (req, res) => {
  const apiKey = (req.body?.apiKey || getActiveApiKey()).trim();

  if (!apiKey) {
    return res.json({
      success: false,
      provider: "Google Gemini",
      error: 'Gemini API key is not configured.',
      status: 'missing_key',
      connected: false
    });
  }

  const result = await verifyGeminiConnection(apiKey);
  if (result.success) {
    return res.json({
      success: true,
      provider: "Google Gemini",
      message: "Gemini connection successful",
      connected: true,
      status: "ready",
      model: result.model
    });
  }
  return res.json({
    success: false,
    provider: "Google Gemini",
    error: result.error || "Gemini connection failed",
    connected: false,
    status: result.status || "api_error"
  });
});

// Section 9: POST /api/save-key — Save & Connect Credential
app.post('/api/save-key', async (req, res) => {
  const { apiKey } = req.body;
  if (apiKey !== undefined) {
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      process.env.GEMINI_API_KEY = '';
      persistEnvKey('GEMINI_API_KEY', '');
      cachedGeminiHealth = null;
      return res.json({
        success: false,
        configured: false,
        status: 'missing_key',
        message: 'Gemini API key cleared.'
      });
    }

    process.env.GEMINI_API_KEY = cleanKey;
    persistEnvKey('GEMINI_API_KEY', cleanKey);
    cachedGeminiHealth = null;

    // Immediately test key against Gemini
    const testResult = await verifyGeminiConnection(cleanKey);
    cachedGeminiHealth = testResult;
    lastHealthCheckTime = Date.now();

    return res.json({
      success: testResult.status === 'ready',
      ...testResult
    });
  }
  return res.status(400).json({ success: false, message: 'No API key provided.' });
});

// Section 6 & 12: POST /api/analyze — Plant Image Analysis Endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const apiKey = (req.body?.apiKey || getActiveApiKey()).trim();

  // Missing API key -> 500
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in .env or configure it in Settings.',
      status: 'missing_key'
    });
  }

  let mimeType = 'image/jpeg';
  let base64Data = '';

  if (req.file) {
    // Multer upload
    mimeType = req.file.mimetype;
    base64Data = req.file.buffer.toString('base64');
  } else if (req.body.image) {
    // JSON upload
    const rawImage = req.body.image;
    const mimeMatch = rawImage.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    mimeType = mimeMatch ? mimeMatch[1] : (req.body.mimeType || 'image/jpeg');
    base64Data = rawImage.includes(',') ? rawImage.split(',')[1] : rawImage;
  }

  // Invalid image -> 400
  if (!base64Data) {
    console.log('[Analysis] Image received: NO');
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing image data. Please upload JPEG, PNG, or WEBP.',
      status: 'invalid_image'
    });
  }

  console.log('[Analysis] Image received: YES');
  console.log(`[Analysis] MIME type: ${mimeType}`);

  const supportedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!supportedMimes.includes(mimeType.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Unsupported image format: ${mimeType}. Please upload JPEG, PNG, or WEBP.`,
      status: 'invalid_image'
    });
  }
  if (mimeType === 'image/jpg') mimeType = 'image/jpeg';

  try {
    console.log('[Gemini] Vision request: START');

    // Complete 11-Step Agricultural Plant Pathology Pipeline
    const stage1Prompt = `You are a certified professional plant pathologist and agricultural vision expert.
Analyze ONLY the image provided in this request following this EXACT 11-step pipeline in order.

STEP 1 — IMAGE VALIDATION:
Determine whether the uploaded image contains usable visual information.
- image_quality: "good" | "acceptable" | "poor"
- If the image is too blurry, dark, or obstructed:
  image_quality = "poor"
  analysis_status = "uncertain"
  health.status = "uncertain"
  health.summary = "The image quality is not sufficient for reliable plant health analysis."
  Do not invent a diagnosis.

STEP 2 — DETECT PLANT MATERIAL:
Determine whether the image contains plant material: leaf, stem, flower, fruit, seed, crop, tree, or whole plant.
IMPORTANT: A close-up image of a leaf MUST be considered plant material (plant_detected = true).
If the image clearly does not contain plant material:
  plant_detected = false
  plant.common_name = "Not a plant"
  plant.scientific_name = ""
  plant.plant_type = ""
  plant.confidence = 100
  health.status = "uncertain"
  health.summary = "The uploaded image does not contain identifiable plant material."
  disease.detected = false
  disease.name = "None"
  disease.type = "None"
  disease.confidence = 0
  disease.severity = "none"
  symptoms = []
  final_summary = "No plant material was detected in this image. Please upload a clear photo of a plant leaf or crop."

STEP 3 — IDENTIFY THE PLANT:
If plant_detected is true, identify:
- plant.common_name (e.g., "Tomato", "Grape", "Apple", "Rice", "Corn", etc. If species cannot be identified with confidence, set common_name to "Unknown plant". Never confuse "Unknown plant" with "Not a plant")
- plant.scientific_name (e.g., "Solanum lycopersicum")
- plant.plant_type (e.g., "Vegetable crop", "Fruit tree", "Cereal crop", "Ornamental")
- plant.confidence (0–100)

STEP 4 — CHECK HEALTH:
Determine exactly one: "healthy" | "diseased" | "uncertain".
- Use "healthy" when there is no reliable visible evidence of disease.
- Use "diseased" when visible symptoms strongly indicate a disease, pest, or disorder.
- Use "uncertain" when the image does not provide enough evidence. Never force a disease diagnosis.

STEP 5 — DISEASE DETECTION:
- If healthy:
  disease.detected = false
  disease.name = "No visible disease detected"
  disease.type = "None"
  disease.confidence = 0
  disease.severity = "none"
  disease.affected_part = "Foliage"
  health.summary = "No visible signs of disease were detected in this image."
- If diseased:
  disease.detected = true
  disease.name = [Actual detected disease name, e.g. "Early Blight", "Late Blight", "Powdery Mildew", "Black Rot"]
  disease.type = [Category, e.g. "Fungal disease", "Bacterial disease", "Viral infection", "Pest damage", "Nutrient deficiency"]
  disease.confidence = [0–100 based strictly on visual clarity]
  disease.severity = "Low" | "Moderate" | "High" | "Severe" | "Unknown"
  disease.affected_part = [e.g. "Leaf foliage", "Stem", "Fruit"]
  health.summary = [Concise description of the diagnosed condition]

STEP 6 — OBSERVED SYMPTOMS:
- symptoms: Array of detailed visible symptoms ONLY supported by the image (e.g., ["Brown circular spots with yellow halos", "Concentric ring lesions", "Marginal leaf necrosis"]). If healthy, list observed healthy features: ["Normal green pigmentation", "Intact leaf cuticle and margins", "No visible lesions or fungal sporulation"].

STEP 7 — SEVERITY:
- disease.severity: "none" (if healthy), or "Low" | "Moderate" | "High" | "Severe" | "Unknown".

STEP 8 — POSSIBLE CAUSE:
- possible_cause.category: "fungal" | "bacterial" | "viral" | "insect/pest" | "nutrient deficiency" | "environmental stress" | "water stress" | "none" | "unknown"
- possible_cause.explanation: Short explanation of the likely cause based on visible morphology. If uncertain, state: "Cause cannot be confirmed from the image alone."

STEP 9 — TREATMENT:
Provide practical treatment in simple language:
- treatment.immediate_actions: Array of immediate actions (e.g., ["Prune and safely discard heavily spotted leaves", "Avoid overhead irrigation"]).
- treatment.biological_options: Array of organic/biological options (e.g., ["Spray cold-pressed neem oil solution", "Apply bio-fungicide like Bacillus subtilis"]).
- treatment.agricultural_options: Array of cultural/agronomic options (e.g., ["Ensure proper spacing for canopy airflow", "Sanitize pruning tools"]).
- treatment.chemical_options: Array of chemical options when appropriate (e.g., ["Apply approved copper-based or systemic fungicide following product label instructions and local agricultural guidance."]).

STEP 10 — PREVENTION:
- prevention: Array of 3–5 practical prevention tips tailored to the plant and condition.

STEP 11 — FINAL SUMMARY:
- general_care: Array of care guidance for watering, sunlight, nutrition, and monitoring.
- final_summary: 2-3 sentence overview answering: What plant is this? Is it healthy or diseased? What visual evidence was found? What should the user do next?

Return ONLY valid JSON matching this schema:
{
  "analysis_status": "complete",
  "plant_detected": true,
  "image_quality": "good",
  "plant": {
    "common_name": "string",
    "scientific_name": "string",
    "plant_type": "string",
    "confidence": 0
  },
  "health": {
    "status": "healthy",
    "confidence": 0,
    "summary": "string"
  },
  "disease": {
    "detected": false,
    "name": "None",
    "type": "None",
    "confidence": 0,
    "severity": "none",
    "affected_part": "string"
  },
  "symptoms": ["string"],
  "possible_cause": {
    "category": "string",
    "explanation": "string"
  },
  "plant_identification_evidence": ["string"],
  "disease_evidence": ["string"],
  "treatment": {
    "immediate_actions": ["string"],
    "biological_options": ["string"],
    "agricultural_options": ["string"],
    "chemical_options": ["string"]
  },
  "prevention": ["string"],
  "general_care": ["string"],
  "final_summary": "string"
}
`;

    const ai = new GoogleGenAI({ apiKey });
    const modelsToTry = [activeWorkingModel, ...SUPPORTED_GEMINI_MODELS.filter(m => m !== activeWorkingModel)];
    let stage1Result = null;
    let modelUsed = activeWorkingModel;
    let lastErr = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`[Gemini] Vision trying model: ${modelName} (attempt ${attempt + 1})`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: stage1Prompt },
                  {
                    inlineData: {
                      mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            config: {
              responseMimeType: 'application/json'
            }
          });

          const rawText = response.text;
          if (rawText) {
            activeWorkingModel = modelName;
            modelUsed = modelName;
            const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            stage1Result = JSON.parse(cleanedText);
            console.log(`[Gemini] Vision request: SUCCESS with ${modelName}`);
            break;
          }
        } catch (err) {
          lastErr = err;
          console.log(`[Gemini] Model ${modelName} error: ${err.message?.slice(0, 100)}`);
          const categorized = categorizeGoogleError(err);
          if (categorized.status === 'authentication_error') {
            console.log('[Gemini] Vision request: FAILED (Authentication)');
            return res.status(502).json({
              success: false,
              error: 'Gemini authentication failed. Check the API key.',
              status: 'authentication_error'
            });
          }
          if (err.status === 503 || err.message?.includes('503') || err.message?.includes('high demand')) {
            await new Promise(r => setTimeout(r, 1200));
          } else {
            break;
          }
        }
      }
      if (stage1Result) break;
    }

    if (!stage1Result) {
      console.log('[Gemini] Vision request: FAILED');
      const categorized = categorizeGoogleError(lastErr || new Error('Analysis failed'));
      return res.status(502).json({
        success: false,
        error: categorized.message,
        status: categorized.status
      });
    }

    // Section 9: Validate result
    const validated = validateAnalysisResult(stage1Result);

    // Section 13: Successful analysis -> 200
    return res.status(200).json({
      success: true,
      analysis: validated,
      ...validated,
      modelUsed
    });

  } catch (err) {
    console.error('[Gemini] Vision request: FAILED (Exception):', err);
    const categorized = categorizeGoogleError(err);
    return res.status(502).json({
      success: false,
      error: categorized.message,
      status: categorized.status
    });
  }
});

// Section 16: Safe Startup Log
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`PlantPulse backend running on http://localhost:${PORT}`);
  console.log('[Server] Backend started');
  console.log(`[Server] Port: ${PORT}`);
  const key = getActiveApiKey();
  console.log(`[Gemini] API key configured: ${key ? 'YES' : 'NO'}`);
  console.log(`[Gemini] Model: ${configuredModel}`);
  if (key) {
    const health = await verifyGeminiConnection(key);
    console.log(`[Gemini] Client initialized: ${health.status === 'ready' ? 'YES' : 'NO'}`);
    console.log(`[Gemini] Health test: ${health.status === 'ready' ? 'SUCCESS' : 'FAILED'}`);
  } else {
    console.log('[Gemini] Client initialized: NO');
  }
});

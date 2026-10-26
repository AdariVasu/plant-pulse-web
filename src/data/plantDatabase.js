// High quality plant leaf SVG visual generators for realistic sample previews
const createLeafSVG = (type) => {
  if (type === 'tomato_blight') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="500" height="500" fill="%23131c15"/>
      <g transform="translate(50,20)">
        <path d="M 200 450 Q 210 250 200 50" fill="none" stroke="%233e5c36" stroke-width="14" stroke-linecap="round"/>
        <path d="M 200 120 C 100 80 50 160 80 260 C 100 320 180 380 200 420 C 220 380 300 320 320 260 C 350 160 300 80 200 120 Z" fill="%234d7c38" stroke="%232b451e" stroke-width="4"/>
        <path d="M 200 120 L 200 420 M 200 200 Q 150 170 120 180 M 200 250 Q 140 230 100 250 M 200 300 Q 150 290 120 320 M 200 200 Q 250 170 280 180 M 200 250 Q 260 230 300 250 M 200 300 Q 250 290 280 320" fill="none" stroke="%233a6128" stroke-width="3"/>
        <circle cx="150" cy="200" r="28" fill="%23eab308" opacity="0.75"/>
        <circle cx="150" cy="200" r="20" fill="%23451a03"/>
        <circle cx="150" cy="200" r="12" fill="%231c0a00"/>
        <circle cx="150" cy="200" r="5" fill="%2378350f"/>
        <circle cx="240" cy="270" r="34" fill="%23eab308" opacity="0.7"/>
        <circle cx="240" cy="270" r="24" fill="%233f1d0b"/>
        <circle cx="240" cy="270" r="15" fill="%23170700"/>
        <circle cx="170" cy="330" r="22" fill="%23ca8a04" opacity="0.7"/>
        <circle cx="170" cy="330" r="14" fill="%23451a03"/>
        <circle cx="260" cy="180" r="18" fill="%23eab308" opacity="0.6"/>
        <circle cx="260" cy="180" r="11" fill="%233f1d0b"/>
        <circle cx="120" cy="260" r="16" fill="%23ca8a04" opacity="0.7"/>
        <circle cx="120" cy="260" r="10" fill="%23451a03"/>
        <path d="M 80 260 Q 60 220 100 160 Q 140 180 120 220 Z" fill="%23ca8a04" opacity="0.55"/>
      </g>
    </svg>`;
  }

  if (type === 'healthy_corn') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="500" height="500" fill="%230f1d13"/>
      <g transform="translate(50,20)">
        <path d="M 100 450 Q 180 200 400 50 Q 250 200 100 450 Z" fill="%2316a34a" stroke="%2315803d" stroke-width="4"/>
        <path d="M 100 450 Q 220 180 395 55" fill="none" stroke="%234ade80" stroke-width="4"/>
        <path d="M 150 380 Q 240 240 350 140 M 180 330 Q 260 210 330 160" fill="none" stroke="%2322c55e" stroke-width="2"/>
      </g>
    </svg>`;
  }

  if (type === 'apple_scab') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="500" height="500" fill="%23121b14"/>
      <g transform="translate(60,40)">
        <path d="M 190 40 C 310 50 360 160 320 310 C 270 410 130 400 70 310 C 20 180 80 40 190 40 Z" fill="%2322c55e" stroke="%2315803d" stroke-width="4"/>
        <path d="M 190 40 L 190 380 M 190 120 Q 120 100 80 140 M 190 200 Q 100 190 70 240 M 190 280 Q 110 270 90 320 M 190 140 Q 270 120 310 160 M 190 220 Q 280 200 310 260" fill="none" stroke="%2316a34a" stroke-width="3"/>
        <circle cx="150" cy="160" r="22" fill="%233f2c00" opacity="0.95"/>
        <circle cx="150" cy="160" r="14" fill="%231f1600"/>
        <circle cx="230" cy="220" r="28" fill="%233f2c00" opacity="0.9"/>
        <circle cx="230" cy="220" r="18" fill="%231c1400"/>
        <circle cx="120" cy="270" r="19" fill="%23332400"/>
        <circle cx="270" cy="140" r="24" fill="%23332400"/>
        <circle cx="200" cy="310" r="16" fill="%233f2c00"/>
      </g>
    </svg>`;
  }

  if (type === 'grape_rot') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="500" height="500" fill="%23131718"/>
      <g transform="translate(40,30)">
        <path d="M 210 50 Q 380 120 360 280 Q 300 420 210 400 Q 100 420 50 280 Q 30 120 210 50 Z" fill="%2315803d" stroke="%23166534" stroke-width="4"/>
        <polygon points="140,150 180,130 210,180 170,210 130,180" fill="%23450a0a" stroke="%23991b1b" stroke-width="2"/>
        <polygon points="230,240 290,210 310,270 270,300 220,270" fill="%23450a0a" stroke="%23991b1b" stroke-width="2"/>
        <polygon points="110,270 160,260 170,310 120,330" fill="%23450a0a" stroke="%23991b1b" stroke-width="2"/>
        <circle cx="170" cy="170" r="4" fill="%23000"/>
        <circle cx="190" cy="160" r="3" fill="%23000"/>
        <circle cx="260" cy="250" r="5" fill="%23000"/>
      </g>
    </svg>`;
  }

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    <rect width="500" height="500" fill="%23101e13"/>
    <path d="M 250 50 C 370 100 400 300 250 450 C 100 300 130 100 250 50 Z" fill="%2322c55e"/>
  </svg>`;
};

export const CROPS_LIST = [
  { id: 'rice', name: 'Rice', icon: '🌾', category: 'Cereals', active: true },
  { id: 'tea', name: 'Tea', icon: '🍃', category: 'Cash Crop', active: false },
  { id: 'tobacco', name: 'Tobacco', icon: '🌿', category: 'Cash Crop', active: false },
  { id: 'pear', name: 'Pear', icon: '🍐', category: 'Fruits', active: false },
  { id: 'banana', name: 'Banana', icon: '🍌', category: 'Fruits', active: false },
  { id: 'tomato', name: 'Tomato', icon: '🍅', category: 'Vegetables', active: false },
  { id: 'maize', name: 'Maize / Corn', icon: '🌽', category: 'Cereals', active: false },
  { id: 'potato', name: 'Potato', icon: '🥔', category: 'Tubers', active: false },
  { id: 'cotton', name: 'Cotton', icon: '☁️', category: 'Fiber', active: false },
  { id: 'wheat', name: 'Wheat', icon: '🌾', category: 'Cereals', active: false },
  { id: 'apple', name: 'Apple', icon: '🍎', category: 'Fruits', active: false },
  { id: 'grape', name: 'Grape', icon: '🍇', category: 'Fruits', active: false }
];

export const PLANT_DISEASES_DATABASE = [
  {
    id: 'tomato_early_blight',
    cropName: 'Tomato Crop',
    botanicalName: 'Solanum lycopersicum',
    diseaseName: 'Septoria Leaf Spot / Early Blight (Alternaria solani)',
    status: 'INFECTED',
    severity: 'High',
    confidence: 97,
    image: createLeafSVG('tomato_blight'),
    symptoms: [
      'Numerous circular dark brown/black concentric ring spots detected on leaf foliage',
      'Chlorotic yellow halo surrounding necrotic spot lesions',
      'Lower older foliage showing advanced tissue degradation and premature defoliation',
      'Stem surface exhibiting elongated dark sunken lesions'
    ],
    immediateAction: [
      'Prune and safely destroy lower infected leaves showing yellowing or spots (do not compost).',
      'Isolate affected plants and avoid overhead sprinkler watering to prevent spore splash.',
      'Ensure immediate airflow around plant canopy by staking vines.'
    ],
    organicFixes: [
      'Apply Bio-Fungicide (Trichoderma viride or Bacillus subtilis) spray at 5g/Liter of water.',
      'Cold-pressed Neem Oil spray (5ml/L + 1ml liquid soap) every 7 days.',
      'Copper Hydroxide organic foliar spray to halt fungal spore germination.'
    ],
    chemicalRemedies: [
      'Mancozeb 75% WP @ 2.5g / Liter water (Spray thoroughly on upper and lower leaf surfaces).',
      'Chlorothalonil 75% WP @ 2g / Liter water as protective cover spray.',
      'Azoxystrobin + Difenoconazole @ 1ml / Liter water for systemic eradication.'
    ],
    prevention: [
      'Step 1: Maintain 60cm row spacing between plants for optimal sunlight & air circulation.',
      'Step 2: Practice strict 3-year crop rotation with non-solanaceous crops (e.g. corn, beans).',
      'Step 3: Apply thick organic straw mulch (5-7cm) to prevent soil-borne spore splashing during rain.'
    ],
    wikipedia: {
      title: 'Tomato & Early Blight Pathology',
      summary: 'Alternaria solani is a fungal pathogen that causes early blight in tomato and potato. The disease leads to defoliation, stem lesions, and fruit rot, reducing yield up to 80% if unmanaged.',
      url: 'https://en.wikipedia.org/wiki/Alternaria_solani'
    },
    weatherRisk: {
      temp: '28°C',
      humidity: '78%',
      sporeRisk: 'HIGH',
      alert: 'High humidity accelerates blight & mildew. Spray protective fungicides before rain.'
    }
  },
  {
    id: 'healthy_corn',
    cropName: 'Corn / Maize Crop',
    botanicalName: 'Zea mays',
    diseaseName: 'Healthy Foliage (No Pathology Detected)',
    status: 'HEALTHY',
    severity: 'Low',
    confidence: 99,
    image: createLeafSVG('healthy_corn'),
    symptoms: [
      'Vibrant deep green chlorophyll distribution across leaf blade',
      'Clean parallel leaf veins with zero necrotic spots or fungal lesions',
      'Intact structural tissue with optimal turgor pressure and crisp leaf margins'
    ],
    immediateAction: [
      'No chemical intervention required.',
      'Continue regular drip irrigation schedule and balanced nitrogen fertilisation.'
    ],
    organicFixes: [
      'Apply balanced Vermicompost / Compost Tea to maintain robust root microbiome.',
      'Foliar spray of Seaweed extract (2ml/L) to boost stress tolerance.'
    ],
    chemicalRemedies: [
      'N/A - Plant is healthy. Maintain standard prophylactic agronomic nutrition.'
    ],
    prevention: [
      'Step 1: Ensure proper field drainage during heavy monsoon rain.',
      'Step 2: Soil testing every season to maintain balanced N-P-K nutrient ratio.',
      'Step 3: Monitor fields weekly for early armyworm or rust spore activity.'
    ],
    wikipedia: {
      title: 'Maize (Zea mays)',
      summary: 'Maize is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. It is one of the world\'s most important staple food and feed crops.',
      url: 'https://en.wikipedia.org/wiki/Maize'
    },
    weatherRisk: {
      temp: '26°C',
      humidity: '55%',
      sporeRisk: 'LOW',
      alert: 'Optimal growth conditions. Low spore atmospheric risk.'
    }
  },
  {
    id: 'apple_scab',
    cropName: 'Apple Orchard',
    botanicalName: 'Malus domestica',
    diseaseName: 'Apple Scab (Venturia inaequalis)',
    status: 'INFECTED',
    severity: 'Moderate',
    confidence: 95,
    image: createLeafSVG('apple_scab'),
    symptoms: [
      'Olive-green velvety spots appearing on young leaves and fruit skin',
      'Leaves turning yellow, twisting, and dropping prematurely',
      'Sunken corky brown scab spots developing on developing fruit surfaces'
    ],
    immediateAction: [
      'Rake and burn/bury all fallen autumn leaves to eliminate overwintering fungal pseudothecia.',
      'Prune dense canopy branches to improve internal tree aeration.'
    ],
    organicFixes: [
      'Liquid Sulfur spray (3g/L) applied early morning before temperature exceeds 28°C.',
      'Potassium Bicarbonate spray (4g/L) to create alkaline leaf surface hostile to spores.'
    ],
    chemicalRemedies: [
      'Myclobutanil 10% WP @ 1g / Liter water.',
      'Captan 50% WP @ 2.5g / Liter water applied from green tip stage through petal fall.'
    ],
    prevention: [
      'Step 1: Plant scab-resistant apple cultivars (e.g. Liberty, Enterprise, Prima).',
      'Step 2: Apply 5% urea spray on leaf canopy just before autumn leaf fall to speed up decomposition.',
      'Step 3: Avoid high-nitrogen fertilizers that generate excess soft tender foliage.'
    ],
    wikipedia: {
      title: 'Venturia inaequalis',
      summary: 'Venturia inaequalis is an ascomycete fungus that causes the apple scab disease. It causes significant economic damage to commercial apple crops worldwide.',
      url: 'https://en.wikipedia.org/wiki/Apple_scab'
    },
    weatherRisk: {
      temp: '20°C',
      humidity: '84%',
      sporeRisk: 'MODERATE-HIGH',
      alert: 'Cool wet spring weather favors ascospore release.'
    }
  },
  {
    id: 'grape_rot',
    cropName: 'Grape Vineyard',
    botanicalName: 'Vitis vinifera',
    diseaseName: 'Grape Black Rot (Guignardia bidwellii)',
    status: 'INFECTED',
    severity: 'High',
    confidence: 94,
    image: createLeafSVG('grape_rot'),
    symptoms: [
      'Small reddish-brown circular spots on leaf surface with dark border',
      'Black pinhead-sized pycnidia fruiting bodies visible inside leaf spots',
      'Infected berries shriveling into hard, black, wrinkled mummies'
    ],
    immediateAction: [
      'Hand-pick and remove all mummified grape clusters remaining on vines or ground.',
      'Pinch off heavily infected shoots and leaf clusters.'
    ],
    organicFixes: [
      'Bordeaux Mixture 1% spray (Copper sulfate + Lime).',
      'Bacillus amyloliquefaciens bio-control agent.'
    ],
    chemicalRemedies: [
      'Tebuconazole 25.9% EC @ 1ml / Liter water.',
      'Mancozeb + Carbendazim combination spray @ 2g / Liter water.'
    ],
    prevention: [
      'Step 1: Keep vineyard floor clean of debris and weeds.',
      'Step 2: Maintain proper vine canopy training (VSP) to ensure maximum sunlight penetration.',
      'Step 3: Apply protective fungicide sprays starting at 2-inch shoot growth stage.'
    ],
    wikipedia: {
      title: 'Guignardia bidwellii',
      summary: 'Guignardia bidwellii is a fungal plant pathogen that causes black rot on grapes. It can completely destroy fruit yield under humid climatic conditions.',
      url: 'https://en.wikipedia.org/wiki/Black_rot_(grape)'
    },
    weatherRisk: {
      temp: '27°C',
      humidity: '72%',
      sporeRisk: 'HIGH',
      alert: 'Warm rain events trigger heavy pycnidiospore discharge.'
    }
  }
];

export const COMMUNITY_POSTS = [
  {
    id: 'p1',
    author: 'Ramesh Patel',
    avatar: '👨‍🌾',
    location: 'Gujarat, India',
    crop: 'Rice',
    time: '2 hours ago',
    title: 'Yellowing of leaf tips in 30-day paddy crop — Nitrogen deficiency or Blast?',
    content: 'Noticed leaf tips turning pale yellow to brownish in my paddy field after recent rainfall. Humidity has been over 80%. Is this nutrient deficiency or early Blast fungal attack?',
    likes: 24,
    commentsCount: 8,
    solved: true,
    agronomistAnswer: 'Based on your image and humidity levels, this is early Bacterial Leaf Blight (Xanthomonas oryzae). Avoid excessive nitrogen fertilizer and apply Streptocycline 1g + Copper Oxychloride 30g per 10L water.'
  },
  {
    id: 'p2',
    author: 'Maria Santos',
    avatar: '👩‍🌾',
    location: 'Veracruz, Mexico',
    crop: 'Coffee / Tea',
    time: '5 hours ago',
    title: 'Organic treatment for orange powdery rust on lower leaves',
    content: 'Looking for organic biocontrol options against Hemileia vastatrix. We avoid synthetic chemicals on our farm.',
    likes: 18,
    commentsCount: 5,
    solved: false,
    agronomistAnswer: null
  },
  {
    id: 'p3',
    author: 'John Kamau',
    avatar: '👨‍🌾',
    location: 'Nakuru, Kenya',
    crop: 'Maize',
    time: '1 day ago',
    title: 'Fall Armyworm outbreak alert in Rift Valley region',
    content: 'Fellow farmers please check leaf whorls for sawdust-like frass. Early spray of Spinetoram or Bacillus thuringiensis saved 90% of my crop!',
    likes: 42,
    commentsCount: 14,
    solved: true,
    agronomistAnswer: 'Great early detection! Applying Neem cake in leaf whorls also deters egg laying.'
  }
];

export const MARKETPLACE_ITEMS = [
  {
    id: 'm1',
    name: 'Bio-Fungicide Trichoderma Viride (1kg)',
    category: 'Biological Control',
    price: '$12.50',
    rating: 4.9,
    reviews: 128,
    image: '🧪',
    badge: 'Organic Certified',
    description: 'Eco-friendly bio-control agent against root rot, damping-off, and leaf spot diseases.'
  },
  {
    id: 'm2',
    name: 'Copper Oxychloride 50% WP (500g)',
    category: 'Fungicide',
    price: '$9.80',
    rating: 4.8,
    reviews: 210,
    image: '🛡️',
    badge: 'Best Seller',
    description: 'Broad-spectrum protective copper fungicide for blight, scab, and spot control.'
  },
  {
    id: 'm3',
    name: 'Cold-Pressed Pure Neem Oil Concentrate (1L)',
    category: 'Organic Insecticide',
    price: '$15.00',
    rating: 4.7,
    reviews: 95,
    image: '🌿',
    badge: '100% Natural',
    description: 'Controls aphids, whiteflies, thrips, and powdery mildew spore germination.'
  },
  {
    id: 'm4',
    name: 'Knapsack Battery Sprayer 16L',
    category: 'Equipment',
    price: '$45.00',
    rating: 4.9,
    reviews: 84,
    image: '🎛️',
    badge: 'Heavy Duty',
    description: 'High-pressure electric battery-operated sprayer with dual brass nozzles.'
  }
];

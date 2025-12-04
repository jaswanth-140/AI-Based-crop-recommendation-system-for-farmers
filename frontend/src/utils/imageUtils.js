/**
 * Image Utility Functions
 * Handles regional farm image fetching with fallback strategy
 */

/**
 * Get regional farm image with fallback strategy
 * Priority:
 * 1. User uploaded farm photo (future implementation)
 * 2. Satellite imagery (future implementation)
 * 3. Unsplash regional images
 * 4. Default gradient
 */
export function getRegionalFarmImage(state, district) {
  // Priority 1 & 2: User uploaded / Satellite imagery (future)
  // For now, skip to Priority 3

  // Priority 3: Unsplash regional images
  const queries = [
    state && district
      ? `https://source.unsplash.com/1600x900/?${encodeURIComponent(state)},${encodeURIComponent(district)},agriculture,farm`
      : null,
    state
      ? `https://source.unsplash.com/1600x900/?${encodeURIComponent(state)},agriculture,farm,fields`
      : null,
    `https://source.unsplash.com/1600x900/?indian,farm,fields,agriculture`,
    `https://source.unsplash.com/1600x900/?agriculture,green,landscape,farm`
  ].filter(Boolean);

  // Return first available query
  return queries[0] || getDefaultGradient();
}

/**
 * Get default gradient background as fallback
 * Creates a beautiful agricultural gradient
 */
export function getDefaultGradient() {
  // Return a data URI for a gradient background matching the app's color scheme
  // Using URL encoding for better browser compatibility
  const svg = encodeURIComponent(`
    <svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e0f2fe;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#ecfccb;stop-opacity:1" />
          <stop offset="60%" style="stop-color:#fef3c7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0fdf4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `.trim());
  return `data:image/svg+xml,${svg}`;
}

/**
 * Get soil type color for badges
 */
export function getSoilTypeColor(soilType) {
  if (!soilType) return 'bg-red-500/80';
  
  const type = soilType.toLowerCase();
  if (type.includes('red')) return 'bg-red-500/80';
  if (type.includes('black')) return 'bg-gray-800/80';
  if (type.includes('alluvial')) return 'bg-amber-500/80';
  if (type.includes('loam')) return 'bg-orange-500/80';
  if (type.includes('clay')) return 'bg-yellow-600/80';
  
  return 'bg-red-500/80'; // Default
}

/**
 * Get crop image with fallback system
 * Priority: Provided image -> Crop-specific Unsplash -> Generic fallback
 */
export function getCropImage(cropName, providedImage = null) {
  if (providedImage && /^https?:\/\//.test(providedImage)) {
    return providedImage;
  }

  const cropImages = {
    'rice': 'https://source.unsplash.com/800x600/?rice,paddy,farming,india',
    'paddy': 'https://source.unsplash.com/800x600/?rice,paddy,farming,india',
    'wheat': 'https://source.unsplash.com/800x600/?wheat,grain,harvest,india',
    'maize': 'https://source.unsplash.com/800x600/?maize,corn,field,india',
    'corn': 'https://source.unsplash.com/800x600/?maize,corn,field,india',
    'cotton': 'https://source.unsplash.com/800x600/?cotton,plant,farming,india',
    'tomato': 'https://source.unsplash.com/800x600/?tomato,vegetable,farm,india',
    'groundnut': 'https://source.unsplash.com/800x600/?groundnut,peanut,field,india',
    'sugarcane': 'https://source.unsplash.com/800x600/?sugarcane,field,agriculture,india',
    'turmeric': 'https://source.unsplash.com/800x600/?turmeric,spice,root,india',
    'jowar': 'https://source.unsplash.com/800x600/?sorghum,jowar,field,india',
    'bajra': 'https://source.unsplash.com/800x600/?pearl,millet,field,india',
    'soybean': 'https://source.unsplash.com/800x600/?soybean,field,agriculture,india',
    'ragi': 'https://source.unsplash.com/800x600/?finger,millet,ragi,india',
    'redgram': 'https://source.unsplash.com/800x600/?pigeon,pea,toor,india',
    'greengram': 'https://source.unsplash.com/800x600/?green,gram,moong,india',
    'blackgram': 'https://source.unsplash.com/800x600/?black,gram,urad,india',
    'bengalgram': 'https://source.unsplash.com/800x600/?chickpea,chana,india',
    'peas': 'https://source.unsplash.com/800x600/?peas,green,vegetable,india',
    'lentil': 'https://source.unsplash.com/800x600/?lentil,masoor,india',
    'sunflower': 'https://source.unsplash.com/800x600/?sunflower,oilseed,india',
    'sesame': 'https://source.unsplash.com/800x600/?sesame,til,seed,india',
    'mustard': 'https://source.unsplash.com/800x600/?mustard,oilseed,india',
    'castor': 'https://source.unsplash.com/800x600/?castor,oilseed,india',
    'jute': 'https://source.unsplash.com/800x600/?jute,fiber,india',
    'ginger': 'https://source.unsplash.com/800x600/?ginger,spice,root,india',
    'chili': 'https://source.unsplash.com/800x600/?chili,pepper,red,india',
    'coriander': 'https://source.unsplash.com/800x600/?coriander,herb,india',
    'cumin': 'https://source.unsplash.com/800x600/?cumin,jeera,spice,india',
    'fennel': 'https://source.unsplash.com/800x600/?fennel,saunf,india',
    'fenugreek': 'https://source.unsplash.com/800x600/?fenugreek,methi,india',
    'onion': 'https://source.unsplash.com/800x600/?onion,vegetable,india',
    'potato': 'https://source.unsplash.com/800x600/?potato,vegetable,india',
    'brinjal': 'https://source.unsplash.com/800x600/?eggplant,brinjal,india',
    'okra': 'https://source.unsplash.com/800x600/?okra,bhindi,vegetable,india',
    'cucumber': 'https://source.unsplash.com/800x600/?cucumber,vegetable,india',
    'bottlegourd': 'https://source.unsplash.com/800x600/?bottle,gourd,vegetable,india',
    'bittergourd': 'https://source.unsplash.com/800x600/?bitter,gourd,vegetable,india',
    'cabbage': 'https://source.unsplash.com/800x600/?cabbage,vegetable,india',
    'cauliflower': 'https://source.unsplash.com/800x600/?cauliflower,vegetable,india',
    'carrot': 'https://source.unsplash.com/800x600/?carrot,vegetable,india',
    'radish': 'https://source.unsplash.com/800x600/?radish,vegetable,india',
    'beetroot': 'https://source.unsplash.com/800x600/?beetroot,vegetable,india',
    'spinach': 'https://source.unsplash.com/800x600/?spinach,leafy,vegetable,india',
    'lettuce': 'https://source.unsplash.com/800x600/?lettuce,leafy,vegetable,india',
    'mango': 'https://source.unsplash.com/800x600/?mango,fruit,tree,india',
    'banana': 'https://source.unsplash.com/800x600/?banana,fruit,plant,india',
    'papaya': 'https://source.unsplash.com/800x600/?papaya,fruit,india',
    'guava': 'https://source.unsplash.com/800x600/?guava,fruit,india',
    'pomegranate': 'https://source.unsplash.com/800x600/?pomegranate,fruit,india',
    'citrus': 'https://source.unsplash.com/800x600/?orange,citrus,fruit,india',
    'coconut': 'https://source.unsplash.com/800x600/?coconut,palm,india',
    'cashew': 'https://source.unsplash.com/800x600/?cashew,nut,tree,india',
    'coffee': 'https://source.unsplash.com/800x600/?coffee,plant,india',
    'tea': 'https://source.unsplash.com/800x600/?tea,plant,leaf,india',
    'cardamom': 'https://source.unsplash.com/800x600/?cardamom,spice,india',
    'blackpepper': 'https://source.unsplash.com/800x600/?black,pepper,spice,india'
  };

  const normalizedName = (cropName || '').toLowerCase().replace(/\(.*?\)/g, '').trim().replace(/\s+/g, '');
  const baseName = normalizedName.split(' ')[0];
  
  return cropImages[normalizedName] || cropImages[baseName] || `https://source.unsplash.com/800x600/?${encodeURIComponent(cropName || 'crop')},agriculture,india,farming`;
}


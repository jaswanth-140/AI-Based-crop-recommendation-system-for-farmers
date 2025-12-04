/**
 * Comprehensive Crop Database
 * Contains 50+ crops with accurate market prices, seasons, and properties
 * Prices are based on Indian market rates (2024 averages)
 */

export const cropDatabase = [
  // Cereals
  { id: 1, name: 'Rice (Paddy)', baseName: 'rice', season: 'Kharif', price: 2100, change: 2.5, waterNeed: 'High', duration: '4-5 months', roi: '₹55K/acre', emoji: '🌾', soilType: 'Alluvial' },
  { id: 2, name: 'Wheat', baseName: 'wheat', season: 'Rabi', price: 2250, change: -1.2, waterNeed: 'Moderate', duration: '4-5 months', roi: '₹48K/acre', emoji: '🌾', soilType: 'Loam' },
  { id: 3, name: 'Maize (Corn)', baseName: 'maize', season: 'Kharif', price: 2150, change: 4.2, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹45K/acre', emoji: '🌽', soilType: 'Well-drained' },
  { id: 4, name: 'Jowar (Sorghum)', baseName: 'jowar', season: 'Kharif', price: 1850, change: 0.8, waterNeed: 'Low', duration: '3-4 months', roi: '₹38K/acre', emoji: '🌾', soilType: 'Red' },
  { id: 5, name: 'Bajra (Pearl Millet)', baseName: 'bajra', season: 'Kharif', price: 1950, change: 1.5, waterNeed: 'Low', duration: '3-4 months', roi: '₹35K/acre', emoji: '🌾', soilType: 'Sandy' },
  { id: 6, name: 'Ragi (Finger Millet)', baseName: 'ragi', season: 'Kharif', price: 3200, change: 3.2, waterNeed: 'Low', duration: '4-5 months', roi: '₹42K/acre', emoji: '🌾', soilType: 'Red' },
  
  // Pulses
  { id: 7, name: 'Red Gram (Tur Dal)', baseName: 'redgram', season: 'Kharif', price: 6800, change: -2.1, waterNeed: 'Low', duration: '3-4 months', roi: '₹52K/acre', emoji: '🫘', soilType: 'Red' },
  { id: 8, name: 'Green Gram (Moong)', baseName: 'greengram', season: 'Kharif', price: 7200, change: 5.3, waterNeed: 'Low', duration: '2-3 months', roi: '₹48K/acre', emoji: '🫘', soilType: 'Sandy Loam' },
  { id: 9, name: 'Black Gram (Urad)', baseName: 'blackgram', season: 'Kharif', price: 7500, change: 4.8, waterNeed: 'Low', duration: '3-4 months', roi: '₹50K/acre', emoji: '🫘', soilType: 'Black' },
  { id: 10, name: 'Bengal Gram (Chana)', baseName: 'bengalgram', season: 'Rabi', price: 5800, change: -1.5, waterNeed: 'Low', duration: '4-5 months', roi: '₹46K/acre', emoji: '🫘', soilType: 'Loam' },
  { id: 11, name: 'Peas', baseName: 'peas', season: 'Rabi', price: 4200, change: 2.1, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹40K/acre', emoji: '🫛', soilType: 'Loam' },
  { id: 12, name: 'Lentil (Masoor)', baseName: 'lentil', season: 'Rabi', price: 6500, change: 1.8, waterNeed: 'Low', duration: '4-5 months', roi: '₹44K/acre', emoji: '🫘', soilType: 'Loam' },
  
  // Oilseeds
  { id: 13, name: 'Groundnut', baseName: 'groundnut', season: 'Kharif', price: 6200, change: -1.5, waterNeed: 'Moderate', duration: '4-5 months', roi: '₹58K/acre', emoji: '🥜', soilType: 'Sandy Loam' },
  { id: 14, name: 'Soybean', baseName: 'soybean', season: 'Kharif', price: 4800, change: 3.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹50K/acre', emoji: '🫘', soilType: 'Black' },
  { id: 15, name: 'Sunflower', baseName: 'sunflower', season: 'Kharif', price: 5500, change: 2.8, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹52K/acre', emoji: '🌻', soilType: 'Loam' },
  { id: 16, name: 'Sesame (Til)', baseName: 'sesame', season: 'Kharif', price: 8500, change: 4.5, waterNeed: 'Low', duration: '3-4 months', roi: '₹48K/acre', emoji: '🌾', soilType: 'Sandy' },
  { id: 17, name: 'Mustard', baseName: 'mustard', season: 'Rabi', price: 5200, change: -0.8, waterNeed: 'Low', duration: '4-5 months', roi: '₹46K/acre', emoji: '🌾', soilType: 'Loam' },
  { id: 18, name: 'Castor', baseName: 'castor', season: 'Kharif', price: 6800, change: 1.2, waterNeed: 'Low', duration: '5-6 months', roi: '₹55K/acre', emoji: '🌿', soilType: 'Red' },
  
  // Cash Crops
  { id: 19, name: 'Sugarcane', baseName: 'sugarcane', season: 'Annual', price: 310, change: 0.5, waterNeed: 'High', duration: '10-12 months', roi: '₹85K/acre', emoji: '🌾', soilType: 'Alluvial' },
  { id: 20, name: 'Cotton', baseName: 'cotton', season: 'Kharif', price: 7200, change: -2.3, waterNeed: 'Moderate', duration: '5-6 months', roi: '₹65K/acre', emoji: '🧵', soilType: 'Black' },
  { id: 21, name: 'Jute', baseName: 'jute', season: 'Kharif', price: 4800, change: 1.5, waterNeed: 'High', duration: '4-5 months', roi: '₹42K/acre', emoji: '🌿', soilType: 'Alluvial' },
  
  // Spices
  { id: 22, name: 'Turmeric', baseName: 'turmeric', season: 'Kharif', price: 8250, change: 6.4, waterNeed: 'Moderate', duration: '8-9 months', roi: '₹92K/acre', emoji: '🌿', soilType: 'Red' },
  { id: 23, name: 'Ginger', baseName: 'ginger', season: 'Kharif', price: 12500, change: 8.2, waterNeed: 'Moderate', duration: '8-9 months', roi: '₹95K/acre', emoji: '🫚', soilType: 'Loam' },
  { id: 24, name: 'Chili (Red)', baseName: 'chili', season: 'Kharif', price: 18500, change: -5.2, waterNeed: 'Moderate', duration: '4-5 months', roi: '₹88K/acre', emoji: '🌶️', soilType: 'Red' },
  { id: 25, name: 'Coriander', baseName: 'coriander', season: 'Rabi', price: 8500, change: 3.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹45K/acre', emoji: '🌿', soilType: 'Loam' },
  { id: 26, name: 'Cumin (Jeera)', baseName: 'cumin', season: 'Rabi', price: 32000, change: 12.5, waterNeed: 'Low', duration: '4-5 months', roi: '₹105K/acre', emoji: '🌾', soilType: 'Sandy' },
  { id: 27, name: 'Fennel (Saunf)', baseName: 'fennel', season: 'Rabi', price: 18500, change: 4.8, waterNeed: 'Low', duration: '4-5 months', roi: '₹68K/acre', emoji: '🌿', soilType: 'Loam' },
  { id: 28, name: 'Fenugreek (Methi)', baseName: 'fenugreek', season: 'Rabi', price: 12500, change: 2.3, waterNeed: 'Low', duration: '3-4 months', roi: '₹42K/acre', emoji: '🌿', soilType: 'Loam' },
  
  // Vegetables
  { id: 29, name: 'Tomato', baseName: 'tomato', season: 'Kharif', price: 2800, change: -8.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹75K/acre', emoji: '🍅', soilType: 'Loam' },
  { id: 30, name: 'Onion', baseName: 'onion', season: 'Rabi', price: 3200, change: 15.2, waterNeed: 'Moderate', duration: '4-5 months', roi: '₹82K/acre', emoji: '🧅', soilType: 'Loam' },
  { id: 31, name: 'Potato', baseName: 'potato', season: 'Rabi', price: 1800, change: -3.2, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹68K/acre', emoji: '🥔', soilType: 'Loam' },
  { id: 32, name: 'Brinjal (Eggplant)', baseName: 'brinjal', season: 'Kharif', price: 4200, change: 2.5, waterNeed: 'Moderate', duration: '4-5 months', roi: '₹72K/acre', emoji: '🍆', soilType: 'Loam' },
  { id: 33, name: 'Okra (Bhindi)', baseName: 'okra', season: 'Kharif', price: 3800, change: 1.8, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹65K/acre', emoji: '🫛', soilType: 'Loam' },
  { id: 34, name: 'Cucumber', baseName: 'cucumber', season: 'Kharif', price: 3200, change: -2.1, waterNeed: 'High', duration: '2-3 months', roi: '₹58K/acre', emoji: '🥒', soilType: 'Loam' },
  { id: 35, name: 'Bottle Gourd', baseName: 'bottlegourd', season: 'Kharif', price: 2800, change: 1.2, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹55K/acre', emoji: '🥒', soilType: 'Loam' },
  { id: 36, name: 'Bitter Gourd', baseName: 'bittergourd', season: 'Kharif', price: 4500, change: 3.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹68K/acre', emoji: '🥒', soilType: 'Loam' },
  { id: 37, name: 'Cabbage', baseName: 'cabbage', season: 'Rabi', price: 2200, change: -1.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹62K/acre', emoji: '🥬', soilType: 'Loam' },
  { id: 38, name: 'Cauliflower', baseName: 'cauliflower', season: 'Rabi', price: 2800, change: 2.8, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹65K/acre', emoji: '🥬', soilType: 'Loam' },
  { id: 39, name: 'Carrot', baseName: 'carrot', season: 'Rabi', price: 3200, change: 1.5, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹58K/acre', emoji: '🥕', soilType: 'Sandy Loam' },
  { id: 40, name: 'Radish', baseName: 'radish', season: 'Rabi', price: 1800, change: 0.8, waterNeed: 'Moderate', duration: '2-3 months', roi: '₹42K/acre', emoji: '🥕', soilType: 'Loam' },
  { id: 41, name: 'Beetroot', baseName: 'beetroot', season: 'Rabi', price: 3500, change: 2.2, waterNeed: 'Moderate', duration: '3-4 months', roi: '₹55K/acre', emoji: '🥕', soilType: 'Loam' },
  { id: 42, name: 'Spinach', baseName: 'spinach', season: 'Rabi', price: 2500, change: 1.8, waterNeed: 'Moderate', duration: '1-2 months', roi: '₹35K/acre', emoji: '🥬', soilType: 'Loam' },
  { id: 43, name: 'Lettuce', baseName: 'lettuce', season: 'Rabi', price: 4200, change: 3.2, waterNeed: 'Moderate', duration: '2-3 months', roi: '₹48K/acre', emoji: '🥬', soilType: 'Loam' },
  
  // Fruits
  { id: 44, name: 'Mango', baseName: 'mango', season: 'Annual', price: 45000, change: 8.5, waterNeed: 'Moderate', duration: '5-6 years', roi: '₹180K/acre', emoji: '🥭', soilType: 'Alluvial' },
  { id: 45, name: 'Banana', baseName: 'banana', season: 'Annual', price: 2800, change: 2.5, waterNeed: 'High', duration: '12-15 months', roi: '₹95K/acre', emoji: '🍌', soilType: 'Alluvial' },
  { id: 46, name: 'Papaya', baseName: 'papaya', season: 'Annual', price: 3200, change: 1.8, waterNeed: 'Moderate', duration: '2-3 years', roi: '₹75K/acre', emoji: '🥭', soilType: 'Loam' },
  { id: 47, name: 'Guava', baseName: 'guava', season: 'Annual', price: 2800, change: 2.2, waterNeed: 'Moderate', duration: '3-4 years', roi: '₹68K/acre', emoji: '🍈', soilType: 'Loam' },
  { id: 48, name: 'Pomegranate', baseName: 'pomegranate', season: 'Annual', price: 8500, change: 4.5, waterNeed: 'Moderate', duration: '3-4 years', roi: '₹125K/acre', emoji: '🍎', soilType: 'Loam' },
  { id: 49, name: 'Citrus (Orange)', baseName: 'citrus', season: 'Annual', price: 4200, change: 3.2, waterNeed: 'Moderate', duration: '4-5 years', roi: '₹95K/acre', emoji: '🍊', soilType: 'Loam' },
  { id: 50, name: 'Coconut', baseName: 'coconut', season: 'Annual', price: 28000, change: 5.8, waterNeed: 'High', duration: '6-8 years', roi: '₹150K/acre', emoji: '🥥', soilType: 'Coastal' },
  { id: 51, name: 'Cashew', baseName: 'cashew', season: 'Annual', price: 125000, change: 8.5, waterNeed: 'Low', duration: '4-5 years', roi: '₹200K/acre', emoji: '🥜', soilType: 'Red' },
  { id: 52, name: 'Coffee', baseName: 'coffee', season: 'Annual', price: 18500, change: 6.2, waterNeed: 'Moderate', duration: '3-4 years', roi: '₹140K/acre', emoji: '☕', soilType: 'Hilly' },
  { id: 53, name: 'Tea', baseName: 'tea', season: 'Annual', price: 185, change: 2.5, waterNeed: 'High', duration: '3-4 years', roi: '₹95K/acre', emoji: '🍃', soilType: 'Hilly' },
  { id: 54, name: 'Cardamom', baseName: 'cardamom', season: 'Annual', price: 185000, change: 12.5, waterNeed: 'High', duration: '3-4 years', roi: '₹250K/acre', emoji: '🌿', soilType: 'Hilly' },
  { id: 55, name: 'Black Pepper', baseName: 'blackpepper', season: 'Annual', price: 68000, change: 8.5, waterNeed: 'Moderate', duration: '3-4 years', roi: '₹180K/acre', emoji: '🌶️', soilType: 'Hilly' }
];

/**
 * Get crop data by name (fuzzy matching)
 */
export function getCropData(cropName) {
  if (!cropName) return null;
  
  const normalized = cropName.toLowerCase().replace(/\(.*?\)/g, '').trim();
  
  // Direct match
  let crop = cropDatabase.find(c => 
    c.name.toLowerCase() === normalized ||
    c.baseName.toLowerCase() === normalized
  );
  
  // Fuzzy match
  if (!crop) {
    crop = cropDatabase.find(c => 
      normalized.includes(c.baseName) ||
      c.baseName.includes(normalized) ||
      normalized.includes(c.name.toLowerCase().split(' ')[0])
    );
  }
  
  return crop || null;
}

/**
 * Get all crops
 */
export function getAllCrops() {
  return cropDatabase;
}

/**
 * Get crops by season
 */
export function getCropsBySeason(season) {
  return cropDatabase.filter(c => c.season === season);
}


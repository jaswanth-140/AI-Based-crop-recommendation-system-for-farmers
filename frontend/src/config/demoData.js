export const DEMO_MODE = false;

export const demoPredictionPayload = {
  success: true,
  location: {
    state: 'Telangana',
    district: 'Nizamabad',
    area: 'Nandipet Mandal'
  },
  weather_data: {
    success: true,
    current: {
      temperature: 31,
      feels_like: 33,
      humidity: 68,
      wind_speed: 3.2,
      pressure: 1008,
      visibility: 7800,
      description: 'partly cloudy'
    },
    agricultural_metrics: {
      growing_degree_days: 18,
      crop_stress_factors: {
        temperature_stress: 'Low'
      },
      optimal_for_crops: ['Paddy', 'Maize', 'Soybean']
    }
  },
  soil_data: {
    success: true,
    soil_type: 'Red Loamy',
    soil_properties: {
      nitrogen: { mean: 0.42, unit: 'g/kg' },
      phh2o: { mean: 6.5 },
      soc: { mean: 0.92, unit: '%' }
    },
    lulc_statistics: {
      forest_percentage: 14,
      agriculture_percentage: 61
    }
  },
  market_data: {
    success: true,
    season: 'Kharif',
    market_analysis: {
      market_status: 'Bullish',
      data_source: 'AGMARKNET',
      average_price: '₹2,150',
      demand_score: 82,
      trend: 'up'
    },
    price_trends: [
      { crop: 'Paddy', price: 2150, change: 4.8, direction: 'up' },
      { crop: 'Maize', price: 1875, change: -1.2, direction: 'down' },
      { crop: 'Turmeric', price: 8250, change: 6.4, direction: 'up' }
    ]
  },
  predictions: {
    top_recommendations: [
      { rank: 1, crop: 'Paddy (RNR-15048)', match_score: 0.97, price_per_quintal: 2150, profit_per_acre: 68000, icon: '🌾' },
      { rank: 2, crop: 'Maize Hybrid 900M', match_score: 0.91, price_per_quintal: 1875, profit_per_acre: 54000, icon: '🌽' },
      { rank: 3, crop: 'Turmeric Salem', match_score: 0.88, price_per_quintal: 8250, profit_per_acre: 92000, icon: '🌿' }
    ],
    summary: 'Moisture-rich Red Loamy soils with bullish Kharif markets favour short-duration paddy followed by maize.',
    success: true
  }
};

export const demoFertilizerSchedules = {
  paddy: [
    {
      day: 0,
      title: 'Basal Dose',
      tasks: ['10 kg N', '26 kg P₂O₅', '26 kg K₂O', 'Organic FYM 2 tons'],
      highlight: false
    },
    {
      day: 25,
      title: 'Vegetative Boost',
      tasks: ['45 kg Urea broadcast', 'Micronutrient foliar spray'],
      highlight: true
    },
    {
      day: 45,
      title: 'Panicle Initiation',
      tasks: ['35 kg Urea', '20 kg MOP'],
      highlight: false
    },
    {
      day: 65,
      title: 'Grain Fill',
      tasks: ['10 kg Urea', 'Zinc foliar spray'],
      highlight: false
    }
  ],
  default: [
    {
      day: 0,
      title: 'Basal Dose',
      tasks: ['Balanced NPK', 'Organic matter'],
      highlight: false
    },
    {
      day: 20,
      title: 'Early Growth',
      tasks: ['Nitrogen support', 'Micronutrients'],
      highlight: false
    },
    {
      day: 40,
      title: 'Flowering Prep',
      tasks: ['Potash + Calcium', 'Foliar spray'],
      highlight: false
    },
    {
      day: 60,
      title: 'Harvest Finish',
      tasks: ['Final N boost', 'Bio stimulants'],
      highlight: false
    }
  ]
};

const demoResponses = {
  en: [
    'Based on today’s weather and soil nitrogen, continue with split urea at day 25 and integrate micronutrient spray for paddy.',
    'Markets in Nizamabad are rewarding high-grade RNR; consider staggering harvest to capture the bullish window.'
  ],
  te: [
    'ఈరోజు వాతావరణం మరియు మట్టి నైట్రోజన్‌ను బట్టి 25వ రోజున యూరియా చిట్టచిట్ట చల్లండి, మైక్రోన్యూట్రియంట్ స్ప్రే జోడించండి.',
    'నిజామాబాద్ మార్కెట్లలో ఆర్‌ఎన్‌ఆర్ ధరలు బలంగా ఉన్నాయి, పంటను విడతల వారీగా కోయాలని పరిశీలించండి.'
  ],
  hi: [
    'आज की मिट्टी में नाइट्रोजन कम है, इसलिए 25वें दिन यूरिया का विभाजित छिड़काव करें और सूक्ष्म पोषक स्प्रे जोड़ें।',
    'निज़ामाबाद मंडी में आरएनआर धान की मांग तेज़ है, कटाई को चरणों में करें।'
  ]
};

export const getDemoChatbotReply = ({ language, history, context }) => {
  const activeLang = demoResponses[language] ? language : 'en';
  const responses = demoResponses[activeLang];
  const messageIndex = history.filter((item) => item.role === 'assistant').length % responses.length;
  const base = responses[messageIndex];

  // Get the last user message to check what they're asking about
  const lastUserMessage = history.filter((item) => item.role === 'user').pop()?.content?.toLowerCase() || '';
  
  // Check if user is asking about fertilizers, pesticides, or chemicals
  const isAskingAboutFertilizers = lastUserMessage.includes('fertilizer') || 
                                    lastUserMessage.includes('fertiliser') ||
                                    lastUserMessage.includes('chemical') ||
                                    lastUserMessage.includes('pesticide') ||
                                    lastUserMessage.includes('nutrient');
  
  // Build context-aware response
  let response = base;
  
  if (isAskingAboutFertilizers) {
    // If asking about fertilizers, ask for crop (soil and season are already known)
    const soilInfo = context?.soil_type ? `Your soil type is ${context.soil_type}` : '';
    const seasonInfo = context?.season ? ` and the current season is ${context.season}` : '';
    response = `${soilInfo}${seasonInfo}. To provide you with the best fertilizer schedule, which crop are you planning to grow or asking about?`;
  } else if (context?.top_crops?.length) {
    response = `${base} Top fit crops right now: ${context.top_crops.slice(0, 3).join(', ')}.`;
  }

  return response;
};


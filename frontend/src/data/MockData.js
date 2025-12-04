export const mockSoil = {
  score: 87,
  nutrients: {
    nitrogen: 78,
    phosphorus: 64,
    potassium: 82
  }
};

export const mockWeather = {
  temperature: 24,
  condition: 'Partly Cloudy',
  humidity: 68,
  wind: 2.3
};

export const mockAlerts = [
  {
    id: 1,
    title: '💧 Irrigation Alert',
    description: 'Soil moisture dipped below 25%. Schedule a quick drip cycle.'
  },
  {
    id: 2,
    title: '📉 Market Price Update',
    description: 'Turmeric prices cooled 3% today in Nizamabad mandis.'
  },
  {
    id: 3,
    title: '🌾 Crop Advisory',
    description: 'Apply micronutrient spray before weekend rains.'
  }
];

export const mockRecommendations = [
  {
    id: 1,
    title: 'Maize Hybrid 900M',
    season: 'Rabi',
    match: 98,
    image: '/crops/maize.jpg'
  },
  {
    id: 2,
    title: 'Groundnut JL-24',
    season: 'Kharif',
    match: 92,
    image: '/crops/groundnut.jpg'
  },
  {
    id: 3,
    title: 'Red Gram ICPL 87119',
    season: 'Kharif',
    match: 88,
    image: '/crops/jowar.jpg'
  },
  {
    id: 4,
    title: 'Sugarcane Co 86032',
    season: 'Annual',
    match: 84,
    image: '/crops/sugarcane.jpg'
  },
  {
    id: 5,
    title: 'Wheat HD 2967',
    season: 'Rabi',
    match: 81,
    image: '/crops/wheat.jpg'
  }
];

export const mockPrices = [
  { crop: 'Maize', price: 2150, change: 4.2 },
  { crop: 'Groundnut', price: 6200, change: -1.5 },
  { crop: 'Jowar', price: 1850, change: 0.8 },
  { crop: 'Sugarcane', price: 310, change: 0.5 },
  { crop: 'Wheat', price: 2200, change: -0.3 }
];


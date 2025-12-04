import axios from 'axios';

// For mobile testing: Replace 'localhost' with your computer's local IP (e.g., '192.168.1.100')
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com/api' 
    : 'http://localhost:5001');  // Backend runs on port 5001

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error('HTTP status:', status, 'Error:', data?.error || 'Unknown error');
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get comprehensive crop prediction with profit analysis
  getCropPrediction: async (latitude, longitude) => {
    try {
      console.log('Requesting crop prediction for:', latitude, longitude);
      const response = await apiClient.post('/predict', {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
      console.log('Prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  },

  // Test API connectivity
  testConnection: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
};

export default apiService;
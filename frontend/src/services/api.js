import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.cache = new Map();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add cache busting for GET requests
        if (config.method === 'get' && !config.params) {
          config.params = { _: Date.now() };
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        
        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  async getWithCache(url, options = {}) {
    const { ttl = 300000, forceRefresh = false } = options;
    const cacheKey = `get:${url}`;
    
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }
    
    try {
      const response = await this.client.get(url);
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      return response.data;
    } catch (error) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  async patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  // Specific API methods
  async getWeather(lat, lon) {
    return this.getWithCache(`/api/weather?lat=${lat}&lon=${lon}`, { ttl: 1800000 });
  }

  async getSoilData(lat, lon) {
    return this.getWithCache(`/api/soil?lat=${lat}&lon=${lon}`, { ttl: 86400000 });
  }

  async getMarketPrices(crop, state) {
    return this.getWithCache(`/api/market/prices?crop=${crop}&state=${state}`, { ttl: 3600000 });
  }

  async getCropRecommendation(data) {
    return this.post('/api/crop/recommendations', data);
  }

  async getComprehensiveAnalysis(data) {
    return this.post('/api/analysis/comprehensive', data);
  }

  clearCache() {
    this.cache.clear();
  }

  clearCacheForUrl(url) {
    const cacheKey = `get:${url}`;
    this.cache.delete(cacheKey);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
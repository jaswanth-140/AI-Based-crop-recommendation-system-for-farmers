"""
Centralized configuration management for the application
"""

import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    DEBUG = FLASK_ENV == 'development'
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # API Keys
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    MANDI_API_KEY = os.getenv('MANDI_API_KEY')
    
    # API URLs
    OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
    BHUVAN_BASE_URL = "https://bhuvan-app1.nrsc.gov.in/api"
    
    # LULC API Keys
    LULC_STATS_KEY = os.getenv('LULC_STATS_KEY', 'default_stats_key')
    LULC_AOI_KEY = os.getenv('LULC_AOI_KEY', 'default_aoi_key')
    
    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    
    # Caching
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', '300'))
    
    # Rate Limiting
    RATE_LIMIT_STORAGE_URL = os.getenv('RATE_LIMIT_STORAGE_URL', 'memory://')
    
    # Model Paths
    MODEL_PATH = os.getenv('MODEL_PATH', 'models/crop_recommendation_model.pkl')
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/app.log')
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    
    @classmethod
    def validate(cls) -> Dict[str, Any]:
        """Validate configuration and return missing required keys"""
        missing = []
        
        if not cls.OPENWEATHER_API_KEY:
            missing.append('OPENWEATHER_API_KEY')
        
        if not cls.GROQ_API_KEY:
            missing.append('GROQ_API_KEY')
        
        return {
            'valid': len(missing) == 0,
            'missing_keys': missing
        }
    
    @classmethod
    def get_all(cls) -> Dict[str, Any]:
        """Get all configuration values"""
        return {
            key: value for key, value in cls.__dict__.items() 
            if not key.startswith('_') and not callable(value)
        }
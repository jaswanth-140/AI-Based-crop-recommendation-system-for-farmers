import os
import logging
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Bhuvan API Configuration
    BHUVAN_BASE_URL = "https://bhuvan-app1.nrsc.gov.in/api"
    VILLAGE_GEOCODE_KEY = os.getenv("VILLAGE_GEOCODE_KEY", "17b3489fd6d3f21ab7dbb742b5895a7992c82408")
    VILLAGE_REVERSE_KEY = os.getenv("VILLAGE_REVERSE_KEY", "841161352a10474f450a93489cee0d62caceaa25")
    LULC_STATS_KEY = os.getenv("LULC_STATS_KEY", "9d7052346513404b8f4c4dee78f5ed3204c5846b")
    LULC_AOI_KEY = os.getenv("LULC_AOI_KEY", "8cbed41f12b745a89475eaca7289d2c22d11c737")
    
    # OpenWeatherMap Configuration
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
    
    # Mandi API Configuration
    MANDI_API_KEY = os.getenv("MANDI_API_KEY", "579b464db66ec23bdd000001765e5653dd0a49c3603fa05bf7aa5f6c")
    
    # Application Configuration
    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # Logging Configuration
    LOG_LEVEL = logging.INFO
    LOG_FILE = "logs/app.log"
    
    # Model Configuration
    MODEL_PATH = "models/crop_recommendation_model.pkl"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE = 60
    
    # Cache Settings
    CACHE_TIMEOUT = 300  # 5 minutes

class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = logging.WARNING

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
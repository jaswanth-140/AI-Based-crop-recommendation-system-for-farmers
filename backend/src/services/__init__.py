"""
Enhanced service classes with circuit breakers and better error handling
"""

import time
from typing import Dict, Optional, List
from ..utils import APILogger, safe_api_request, retry_api_call, cache
from ..config import Config

logger = APILogger()

class CircuitBreaker:
    """Circuit breaker pattern for API calls"""
    
    def __init__(self, failure_threshold: int = 5, reset_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.failures = 0
        self.last_failure_time = 0
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def can_execute(self) -> bool:
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = "HALF_OPEN"
                return True
            return False
        return True
    
    def record_success(self):
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
        self.failures = 0
    
    def record_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        
        if self.failures >= self.failure_threshold:
            self.state = "OPEN"

class WeatherService:
    """Enhanced weather service with circuit breaker"""
    
    def __init__(self):
        self.api_key = Config.OPENWEATHER_API_KEY
        self.base_url = Config.OPENWEATHER_BASE_URL
        self.circuit_breaker = CircuitBreaker()
    
    @retry_api_call(max_retries=3)
    @cache(ttl=1800)  # Cache for 30 minutes
    def get_current_weather(self, latitude: float, longitude: float) -> Optional[Dict]:
        if not self.circuit_breaker.can_execute():
            logger.log_warning("Weather API circuit breaker is OPEN")
            return None
        
        url = f"{self.base_url}/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key,
            "units": "metric"
        }
        
        try:
            response = safe_api_request(url, params)
            if response:
                self.circuit_breaker.record_success()
                return self._parse_weather_data(response)
            else:
                self.circuit_breaker.record_failure()
                return None
                
        except Exception as e:
            self.circuit_breaker.record_failure()
            logger.log_error("Weather API call failed", e)
            return None
    
    def _parse_weather_data(self, data: Dict) -> Dict:
        """Parse and format weather data"""
        return {
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed'],
            'pressure': data['main']['pressure'],
            'visibility': data.get('visibility', 0),
            'clouds': data['clouds']['all'],
            'timestamp': data['dt']
        }

class SoilService:
    """Enhanced soil service with fallback data"""
    
    def __init__(self):
        self.base_url = Config.BHUVAN_BASE_URL
        self.circuit_breaker = CircuitBreaker()
    
    @retry_api_call(max_retries=2)
    @cache(ttl=86400)  # Cache for 24 hours
    def get_soil_data(self, latitude: float, longitude: float) -> Optional[Dict]:
        if not self.circuit_breaker.can_execute():
            logger.log_warning("Soil API circuit breaker is OPEN")
            return self._get_fallback_soil_data(latitude, longitude)
        
        # Implementation would call Bhuvan API here
        # For now, return fallback data
        return self._get_fallback_soil_data(latitude, longitude)
    
    def _get_fallback_soil_data(self, latitude: float, longitude: float) -> Dict:
        """Provide fallback soil data based on coordinates"""
        # Simple heuristic based on latitude
        if latitude > 28:  # Northern regions
            return {
                'type': 'Alluvial',
                'ph': 7.2,
                'organic_matter': 2.1,
                'nitrogen': 45,
                'phosphorus': 25,
                'potassium': 180,
                'moisture': 18.5
            }
        else:  # Southern regions
            return {
                'type': 'Red Soil',
                'ph': 6.8,
                'organic_matter': 1.8,
                'nitrogen': 38,
                'phosphorus': 22,
                'potassium': 160,
                'moisture': 16.2
            }

class MarketService:
    """Enhanced market service with multiple data sources"""
    
    def __init__(self):
        self.circuit_breaker = CircuitBreaker()
    
    @retry_api_call(max_retries=3)
    @cache(ttl=3600)  # Cache for 1 hour
    def get_market_prices(self, crop: str, state: str = None) -> Optional[List[Dict]]:
        if not self.circuit_breaker.can_execute():
            logger.log_warning("Market API circuit breaker is OPEN")
            return self._get_fallback_prices(crop, state)
        
        # Implementation would call multiple market data APIs
        # For now, return realistic fallback data
        return self._get_fallback_prices(crop, state)
    
    def _get_fallback_prices(self, crop: str, state: str = None) -> List[Dict]:
        """Provide realistic fallback market prices"""
        base_prices = {
            'rice': 2500,
            'wheat': 2200,
            'maize': 1800,
            'cotton': 6000,
            'chickpea': 4500
        }
        
        base_price = base_prices.get(crop.lower(), 2000)
        
        # Add some regional variation
        if state:
            state_multiplier = {
                'punjab': 1.1,
                'haryana': 1.05,
                'uttar pradesh': 1.0,
                'madhya pradesh': 0.95,
                'maharashtra': 0.98
            }
            multiplier = state_multiplier.get(state.lower(), 1.0)
            base_price *= multiplier
        
        return [{
            'market': 'Virtual Mandi',
            'price': round(base_price, 2),
            'unit': 'Quintal',
            'state': state or 'All India',
            'timestamp': int(time.time())
        }]
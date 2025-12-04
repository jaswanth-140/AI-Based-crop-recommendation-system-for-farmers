import requests
from config import Config
from utils import safe_api_request, retry_api_call, APILogger, cache
from typing import Dict, Optional

logger = APILogger("logs/weather.log")

class WeatherService:
    def __init__(self):
        self.api_key = Config.OPENWEATHER_API_KEY
        self.base_url = Config.OPENWEATHER_BASE_URL
    
    @retry_api_call(max_retries=3)
    def get_current_weather(self, latitude: float, longitude: float) -> Optional[Dict]:
        cache_key = f"current_weather_{latitude}_{longitude}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
        
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
                logger.log_api_call("current_weather", params, 200)
                cache.set(cache_key, response)
                return response
            else:
                logger.log_error(f"Failed to get weather for: {latitude}, {longitude}")
                return None
        except Exception as e:
            logger.log_error(f"Exception in get_current_weather", e)
            return None
    
    def process_weather_data(self, latitude: float, longitude: float) -> Dict:
        current_weather = self.get_current_weather(latitude, longitude)
        
        processed_data = {
            "current": self.parse_current_weather(current_weather) if current_weather else {},
            "agricultural_metrics": self.calculate_agricultural_metrics(current_weather),
            "success": True if current_weather else False
        }
        
        return processed_data
    
    def parse_current_weather(self, weather_data: Dict) -> Dict:
        if not weather_data:
            return {}
        
        main = weather_data.get("main", {})
        weather = weather_data.get("weather", [{}])[0]
        wind = weather_data.get("wind", {})
        
        return {
            "temperature": main.get("temp", 0),
            "feels_like": main.get("feels_like", 0),
            "humidity": main.get("humidity", 0),
            "pressure": main.get("pressure", 0),
            "description": weather.get("description", ""),
            "wind_speed": wind.get("speed", 0),
            "wind_direction": wind.get("deg", 0),
            "visibility": weather_data.get("visibility", 0)
        }
    
    def calculate_agricultural_metrics(self, current_weather: Dict) -> Dict:
        if not current_weather:
            return {}
        
        main = current_weather.get("main", {})
        temperature = main.get("temp", 0)
        humidity = main.get("humidity", 0)
        
        # Calculate Growing Degree Days (GDD)
        base_temp = 10
        gdd = max(0, temperature - base_temp)
        
        return {
            "growing_degree_days": round(gdd, 2),
            "crop_stress_factors": {
                "temperature_stress": "High" if temperature > 35 else "Medium" if temperature > 30 else "Low",
                "humidity_stress": "High" if humidity > 80 or humidity < 30 else "Low"
            },
            "optimal_for_crops": self.get_optimal_crops_by_weather(temperature, humidity)
        }
    
    def get_optimal_crops_by_weather(self, temperature: float, humidity: float) -> list:
        optimal_crops = []
        
        if 20 <= temperature <= 35 and humidity > 60:
            optimal_crops.append("Rice")
        if 15 <= temperature <= 25 and humidity < 70:
            optimal_crops.append("Wheat")
        if 21 <= temperature <= 30 and humidity > 50:
            optimal_crops.append("Cotton")
        if 18 <= temperature <= 32 and humidity > 40:
            optimal_crops.append("Maize")
        
        return optimal_crops

# Create global instance
weather_service = WeatherService()

def get_weather_data(latitude: float, longitude: float) -> Dict:
    return weather_service.process_weather_data(latitude, longitude)
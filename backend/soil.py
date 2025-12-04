import requests
from config import Config
from utils import safe_api_request, retry_api_call, APILogger, cache
from typing import Dict, Optional

logger = APILogger("logs/soil.log")

class SoilService:
    def __init__(self):
        self.base_url = Config.BHUVAN_BASE_URL
        self.lulc_stats_key = Config.LULC_STATS_KEY
        self.lulc_aoi_key = Config.LULC_AOI_KEY
    
    @retry_api_call(max_retries=3)
    def get_lulc_statistics(self, district: str, state: str = None) -> Optional[Dict]:
        cache_key = f"lulc_stats_{district}_{state}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
        
        url = f"{self.base_url}/thematic/lulcStatistics"
        params = {
            "district": district,
            "key": self.lulc_stats_key
        }
        
        if state:
            params["state"] = state
        
        try:
            response = safe_api_request(url, params)
            if response:
                logger.log_api_call("lulc_statistics", params, 200)
                cache.set(cache_key, response)
                return response
            else:
                logger.log_error(f"Failed to get LULC statistics for: {district}")
                return None
        except Exception as e:
            logger.log_error(f"Exception in get_lulc_statistics", e)
            return None
    
    def get_soilgrids_data(self, latitude: float, longitude: float) -> Optional[Dict]:
        cache_key = f"soilgrids_{latitude}_{longitude}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
        
        properties = ["phh2o", "nitrogen", "soc", "sand", "clay", "silt"]
        soil_data = {}
        
        for prop in properties:
            url = f"https://rest.isric.org/soilgrids/v2.0/properties/query"
            params = {
                "lon": longitude,
                "lat": latitude,
                "property": prop,
                "depth": "0-5cm"
            }
            
            try:
                response = safe_api_request(url, params, timeout=10)
                if response and "properties" in response:
                    soil_data[prop] = response
                    logger.log_api_call("soilgrids", params, 200)
            except Exception as e:
                logger.log_error(f"Failed to get SoilGrids data for {prop}", e)
        
        if soil_data:
            cache.set(cache_key, soil_data)
        
        return soil_data if soil_data else None
    
    def process_soil_data(self, latitude: float, longitude: float, location_info: Dict) -> Dict:
        district = location_info.get("district", "Unknown")
        state = location_info.get("state", "Unknown")
        
        lulc_stats = self.get_lulc_statistics(district, state)
        soilgrids_data = self.get_soilgrids_data(latitude, longitude)
        
        processed_data = {
            "location": {
                "district": district,
                "state": state,
                "coordinates": {"lat": latitude, "lon": longitude}
            },
            "lulc_statistics": self.parse_lulc_stats(lulc_stats) if lulc_stats else {},
            "soil_properties": self.parse_soilgrids_data(soilgrids_data) if soilgrids_data else {},
            "success": True if (lulc_stats or soilgrids_data) else False
        }
        
        return processed_data
    
    def parse_lulc_stats(self, lulc_data: Dict) -> Dict:
        if not lulc_data or not lulc_data.get("success", False):
            return {}
        
        data = lulc_data.get("data", {})
        return {
            "total_area": data.get("totalArea", 0),
            "forest_area": data.get("forestArea", 0),
            "agricultural_area": data.get("agriculturalArea", 0),
            "forest_percentage": data.get("forestPercentage", 0),
            "agriculture_percentage": data.get("agriculturePercentage", 0)
        }
    
    def parse_soilgrids_data(self, soilgrids_data: Dict) -> Dict:
        if not soilgrids_data:
            return {}
        
        parsed_data = {}
        
        for prop, data in soilgrids_data.items():
            if "properties" in data and "layers" in data["properties"]:
                layers = data["properties"]["layers"]
                if layers and len(layers) > 0:
                    values = layers[0].get("depths", [])
                    if values and len(values) > 0:
                        parsed_data[prop] = {
                            "mean": values[0].get("values", {}).get("mean", 0),
                            "unit": values[0].get("unit_measure", {}).get("mapped_units", "")
                        }
        
        return parsed_data

# Create global instance
soil_service = SoilService()

def get_soil_data(latitude: float, longitude: float, location_info: Dict) -> Dict:
    return soil_service.process_soil_data(latitude, longitude, location_info)
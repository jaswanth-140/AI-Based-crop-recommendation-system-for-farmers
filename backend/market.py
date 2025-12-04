import requests
from config import Config
from utils import safe_api_request, retry_api_call, APILogger, cache
from typing import Dict, Optional, List
import json

logger = APILogger("logs/market.log")

class MarketService:
    def __init__(self):
        self.api_key = Config.MANDI_API_KEY
        self.base_url = "https://api.data.gov.in/resource"
    
    @retry_api_call(max_retries=3)
    def get_mandi_prices(self, state: str = None, district: str = None) -> Optional[Dict]:
        cache_key = f"mandi_prices_{state}_{district}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
        
        # Data.gov.in API for mandi prices
        resource_id = "9ef84268-d588-465a-a308-a864a43d0070"
        url = f"{self.base_url}/{resource_id}"
        
        params = {
            "api-key": self.api_key,
            "format": "json",
            "limit": 100
        }
        
        if state:
            params["filters[state]"] = state
        if district:
            params["filters[district]"] = district
        
        try:
            response = safe_api_request(url, params)
            if response:
                logger.log_api_call("mandi_prices", params, 200)
                cache.set(cache_key, response)
                return response
            else:
                logger.log_error(f"Failed to get mandi prices for: {state}, {district}")
                return None
        except Exception as e:
            logger.log_error(f"Exception in get_mandi_prices", e)
            return None
    
    def process_market_data(self, state: str, district: str = None) -> Dict:
        mandi_prices = self.get_mandi_prices(state, district)
        
        processed_data = {
            "current_prices": self.parse_mandi_prices(mandi_prices) if mandi_prices else {},
            "market_analysis": self.analyze_market_conditions(mandi_prices),
            "success": True if mandi_prices else False
        }
        
        return processed_data
    
    def parse_mandi_prices(self, mandi_data: Dict) -> Dict:
        if not mandi_data or "records" not in mandi_data:
            return {}
        
        records = mandi_data["records"]
        crop_prices = {}
        
        for record in records:
            commodity = record.get("commodity", "Unknown")
            variety = record.get("variety", "")
            min_price = self.safe_float(record.get("min_price", 0))
            max_price = self.safe_float(record.get("max_price", 0))
            modal_price = self.safe_float(record.get("modal_price", 0))
            
            crop_key = f"{commodity}_{variety}" if variety else commodity
            
            if crop_key not in crop_prices:
                crop_prices[crop_key] = []
            
            crop_prices[crop_key].append({
                "market": record.get("market", "Unknown"),
                "district": record.get("district", "Unknown"),
                "min_price": min_price,
                "max_price": max_price,
                "modal_price": modal_price,
                "arrival_date": record.get("arrival_date", "Unknown")
            })
        
        # Calculate averages for each crop
        crop_averages = {}
        for crop, prices in crop_prices.items():
            avg_min = sum(p["min_price"] for p in prices) / len(prices)
            avg_max = sum(p["max_price"] for p in prices) / len(prices)
            avg_modal = sum(p["modal_price"] for p in prices) / len(prices)
            
            crop_averages[crop] = {
                "average_min_price": round(avg_min, 2),
                "average_max_price": round(avg_max, 2),
                "average_modal_price": round(avg_modal, 2),
                "price_trend": self.calculate_price_trend(avg_min, avg_max, avg_modal),
                "markets_count": len(prices)
            }
        
        return crop_averages
    
    def analyze_market_conditions(self, mandi_data: Dict) -> Dict:
        analysis = {
            "market_status": "Unknown",
            "price_volatility": "Medium",
            "recommended_crops": [],
            "market_risks": []
        }
        
        if not mandi_data:
            return analysis
        
        records = mandi_data.get("records", [])
        if not records:
            return analysis
        
        # Analyze price volatility
        price_ranges = []
        for record in records:
            min_price = self.safe_float(record.get("min_price", 0))
            max_price = self.safe_float(record.get("max_price", 0))
            if max_price > 0:
                volatility = ((max_price - min_price) / max_price) * 100
                price_ranges.append(volatility)
        
        if price_ranges:
            avg_volatility = sum(price_ranges) / len(price_ranges)
            if avg_volatility > 30:
                analysis["price_volatility"] = "High"
                analysis["market_risks"].append("High price volatility detected")
            elif avg_volatility < 10:
                analysis["price_volatility"] = "Low"
            
        # Simple market status assessment
        high_price_crops = []
        for record in records:
            modal_price = self.safe_float(record.get("modal_price", 0))
            commodity = record.get("commodity", "")
            
            if modal_price > 2000 and commodity:
                high_price_crops.append(commodity)
        
        analysis["recommended_crops"] = list(set(high_price_crops))[:5]
        
        if high_price_crops:
            analysis["market_status"] = "Favorable"
        else:
            analysis["market_status"] = "Moderate"
        
        return analysis
    
    def safe_float(self, value) -> float:
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0.0
    
    def calculate_price_trend(self, min_price: float, max_price: float, modal_price: float) -> str:
        if modal_price > (min_price + max_price) / 2:
            return "Upward"
        elif modal_price < (min_price + max_price) / 2:
            return "Downward"
        else:
            return "Stable"

# Create global instance
market_service = MarketService()

def get_market_data(state: str, district: str = None) -> Dict:
    return market_service.process_market_data(state, district)
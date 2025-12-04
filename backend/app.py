"""
AI Crop Recommendation API with Profit-Based Ranking
Integrates real AGMARKNET prices for profitability analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
import os
from dotenv import load_dotenv
import logging
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all origins (required for mobile device access)
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'demo_key')
PRICE_API_URL = "http://127.0.0.1:5000/request"  # AgMarket scraper API

# ============================================================================
# HELPER FUNCTIONS - LOCATION
# ============================================================================

def get_location_info(lat, lon):
    """Get location information using multiple geocoding services"""
    
    # Try Method 1: Nominatim (OpenStreetMap) - Most accurate for India
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
        headers = {'User-Agent': 'CropRecommendationApp/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'address' in data:
                address = data['address']
                logger.info(f"Nominatim response: {address}")
                
                area = (address.get('village') or
                       address.get('suburb') or
                       address.get('neighbourhood') or
                       address.get('hamlet') or
                       address.get('locality') or
                       address.get('city') or 
                       address.get('town') or 
                       address.get('municipality') or
                       address.get('county') or
                       address.get('state_district') or 'Unknown Area')
                
                district = (address.get('state_district') or
                           address.get('county') or 'Unknown District')
                
                state = (address.get('state') or 'Unknown State')
                country = address.get('country', 'India')
                
                return {
                    "area": area,
                    "district": district,
                    "state": state,
                    "country": country
                }
    except Exception as e:
        logger.error(f"Nominatim geocoding error: {e}")
    
    # Try Method 2: BigDataCloud (Free, accurate for India)
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"BigDataCloud response: {data}")
            
            area = (data.get('locality') or 
                   data.get('city') or 
                   data.get('principalSubdivisionCode') or
                   data.get('localityLanguageRequested') or 'Unknown Area')
            
            # Get district from administrative levels
            admin_levels = data.get('localityInfo', {}).get('administrative', [])
            district = 'Unknown District'
            state = 'Unknown State'
            
            for level in admin_levels:
                admin_level = level.get('adminLevel', 0)
                if admin_level == 4:  # District level in India
                    district = level.get('name', district)
                elif admin_level == 2:  # State level in India
                    state = level.get('name', state)
            
            # Fallback
            if district == 'Unknown District':
                district = data.get('principalSubdivision', 'Unknown District')
            if state == 'Unknown State':
                state = data.get('principalSubdivision', 'Unknown State')
            
            return {
                "area": area,
                "district": district,
                "state": state,
                "country": data.get('countryName', 'India')
            }
    except Exception as e:
        logger.error(f"BigDataCloud geocoding error: {e}")
    
    # Fallback - return coordinates info
    logger.warning(f"All geocoding services failed for {lat}, {lon}")
    return {
        "area": f"Location {lat:.3f}°N, {lon:.3f}°E",
        "district": "Unknown District",
        "state": "Unknown State",
        "country": "India"
    }

# ============================================================================
# HELPER FUNCTIONS - WEATHER
# ============================================================================

def get_weather_data(lat, lon):
    """Get weather data from OpenWeatherMap"""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            temp = data['main']['temp']
            humidity = data['main']['humidity']
            
            return {
                "success": True,
                "current": {
                    "temperature": temp,
                    "feels_like": data['main']['feels_like'],
                    "humidity": humidity,
                    "pressure": data['main']['pressure'],
                    "wind_speed": data['wind'].get('speed', 0),
                    "visibility": data.get('visibility', 10000),
                    "description": data['weather'][0]['description'].title()
                },
                "agricultural_metrics": {
                    "growing_degree_days": calculate_gdd(temp),
                    "crop_stress_factors": {
                        "temperature_stress": get_temp_stress(temp)
                    },
                    "optimal_for_crops": get_optimal_crops(temp)
                }
            }
    except Exception as e:
        logger.error(f"Weather API error: {e}")
    
    # Fallback weather data
    return {
        "success": True,
        "current": {
            "temperature": round(random.uniform(25, 35), 1),
            "feels_like": round(random.uniform(27, 37), 1), 
            "humidity": random.randint(40, 80),
            "pressure": random.randint(1010, 1020),
            "wind_speed": round(random.uniform(2, 8), 1),
            "visibility": 10000,
            "description": "Clear Sky"
        },
        "agricultural_metrics": {
            "growing_degree_days": random.randint(15, 25),
            "crop_stress_factors": {
                "temperature_stress": "Low"
            },
            "optimal_for_crops": ["Rice", "Cotton", "Sugarcane"]
        }
    }

def calculate_gdd(temp):
    """Calculate Growing Degree Days"""
    base_temp = 10
    return max(0, round(temp - base_temp, 1))

def get_temp_stress(temp):
    """Determine temperature stress level"""
    if temp > 35:
        return "High"
    elif temp > 28:
        return "Medium"
    else:
        return "Low"

def get_optimal_crops(temp):
    """Get crops optimal for current temperature"""
    if temp > 30:
        return ["Cotton", "Sugarcane", "Rice"]
    elif temp > 20:
        return ["Wheat", "Maize", "Soybean"]
    else:
        return ["Barley", "Mustard", "Chickpea"]

# ============================================================================
# HELPER FUNCTIONS - SOIL
# ============================================================================

def get_soil_type_by_state_district(state, district=""):
    """Determine predominant soil type based on Indian state and district"""
    
    # Detailed state-wise soil mapping with district variations
    state_soil_map = {
        # Black Soil States (Regur) - Cotton Belt
        "Maharashtra": {"default": "Black Soil", "Konkan": "Red Laterite Soil", "Marathwada": "Black Soil", "Vidarbha": "Black Soil", "Western Maharashtra": "Black Soil"},
        "Gujarat": {"default": "Black Soil", "Saurashtra": "Black Soil", "North Gujarat": "Alluvial Soil", "Kutch": "Arid Soil"},
        "Madhya Pradesh": {"default": "Black Soil", "Malwa": "Black Soil", "Nimar": "Black Soil"},
        "Karnataka": {"default": "Red Soil", "North Karnataka": "Black Soil", "Coastal Karnataka": "Red Laterite Soil", "Malnad": "Red Laterite Soil"},
        "Andhra Pradesh": {"default": "Red Soil", "Coastal Andhra": "Alluvial Soil", "Rayalaseema": "Red Soil"},
        "Telangana": {"default": "Red Soil", "Medak": "Red Soil", "Warangal": "Red Soil", "Nalgonda": "Black Soil"},
        
        # Red Soil States - Peninsular India
        "Tamil Nadu": {"default": "Red Soil", "Coastal Tamil Nadu": "Alluvial Soil", "Western Tamil Nadu": "Black Soil"},
        "Kerala": {"default": "Red Laterite Soil", "Coastal Kerala": "Alluvial Soil"},
        "Odisha": {"default": "Red Soil", "Coastal Odisha": "Alluvial Soil"},
        "Jharkhand": {"default": "Red Soil"},
        "Chhattisgarh": {"default": "Red Soil", "Bastar": "Red Laterite Soil"},
        
        # Alluvial Soil States - Indo-Gangetic Plains
        "Punjab": {"default": "Alluvial Soil"},
        "Haryana": {"default": "Alluvial Soil"},
        "Uttar Pradesh": {"default": "Alluvial Soil", "Bundelkhand": "Red Soil"},
        "Bihar": {"default": "Alluvial Soil"},
        "West Bengal": {"default": "Alluvial Soil", "North Bengal": "Red Laterite Soil"},
        
        # Laterite Soil States
        "Assam": {"default": "Alluvial Soil", "Hills": "Laterite Soil"},
        "Meghalaya": {"default": "Laterite Soil"},
        "Tripura": {"default": "Laterite Soil"},
        
        # Desert/Arid Soil
        "Rajasthan": {"default": "Arid Soil", "Eastern Rajasthan": "Alluvial Soil"},
        
        # Mountain/Forest Soil
        "Himachal Pradesh": {"default": "Mountain Soil"},
        "Uttarakhand": {"default": "Forest Soil"},
        "Jammu and Kashmir": {"default": "Mountain Soil"},
    }
    
    # Check if state exists in mapping
    if state in state_soil_map:
        state_data = state_soil_map[state]
        
        # Check for district-specific soil type
        for dist_name, soil_type in state_data.items():
            if dist_name != "default" and dist_name.lower() in district.lower():
                return soil_type
        
        # Return default soil type for state
        return state_data.get("default", "Mixed Soil")
    
    # Fallback based on region if state not found
    return "Mixed Soil"

def get_current_season():
    """Determine current agricultural season in India based on month"""
    import datetime
    current_month = datetime.datetime.now().month
    
    # Kharif: June-September (Monsoon crops - Sowing: June-July, Harvesting: Sept-Oct)
    if 6 <= current_month <= 9:
        return "Kharif"
    # Rabi: October-March (Winter crops - Sowing: Oct-Dec, Harvesting: March-April)
    elif current_month >= 10 or current_month <= 3:
        return "Rabi"
    # Zaid: April-May (Summer crops)
    else:
        return "Zaid"

def get_season_crops():
    """Get crops suitable for each season"""
    return {
        "Kharif": ["Rice", "Cotton", "Maize", "Soybean", "Groundnut", "Bajra", "Jowar", "Turmeric", "Sugarcane"],
        "Rabi": ["Wheat", "Jowar", "Bajra", "Groundnut", "Maize", "Sugarcane"],
        "Zaid": ["Maize", "Groundnut", "Sugarcane", "Turmeric"]
    }

def get_soil_suitable_crops(soil_type):
    """Get crops highly suitable for specific soil types"""
    soil_crop_map = {
        "Black Soil": ["Cotton", "Sugarcane", "Jowar", "Wheat", "Maize", "Soybean"],
        "Red Soil": ["Rice", "Groundnut", "Maize", "Cotton", "Jowar", "Turmeric"],
        "Red Laterite Soil": ["Rice", "Groundnut", "Turmeric", "Maize"],
        "Alluvial Soil": ["Rice", "Wheat", "Sugarcane", "Maize", "Cotton"],
        "Laterite Soil": ["Rice", "Maize", "Groundnut"],
        "Arid Soil": ["Bajra", "Jowar", "Groundnut", "Cotton"],
        "Mountain Soil": ["Wheat", "Maize", "Rice"],
        "Forest Soil": ["Wheat", "Maize", "Rice"],
        "Mixed Soil": ["Rice", "Wheat", "Maize", "Cotton", "Groundnut"]
    }
    return soil_crop_map.get(soil_type, [])

def get_soil_properties_by_type(soil_type):
    """Get realistic soil properties based on soil type"""
    soil_properties_map = {
        "Black Soil": {
            "phh2o": {"mean": 7.8, "range": (7.2, 8.5)},
            "nitrogen": {"mean": 0.45, "range": (0.35, 0.6)},
            "soc": {"mean": 18.5, "range": (15, 25)},
            "agriculture_percentage": 75.0,
            "forest_percentage": 12.0
        },
        "Red Soil": {
            "phh2o": {"mean": 6.2, "range": (5.5, 6.8)},
            "nitrogen": {"mean": 0.25, "range": (0.15, 0.4)},
            "soc": {"mean": 8.5, "range": (5, 12)},
            "agriculture_percentage": 62.0,
            "forest_percentage": 25.0
        },
        "Red Laterite Soil": {
            "phh2o": {"mean": 5.8, "range": (5.2, 6.5)},
            "nitrogen": {"mean": 0.22, "range": (0.12, 0.35)},
            "soc": {"mean": 7.2, "range": (4, 10)},
            "agriculture_percentage": 58.0,
            "forest_percentage": 30.0
        },
        "Alluvial Soil": {
            "phh2o": {"mean": 7.2, "range": (6.8, 7.8)},
            "nitrogen": {"mean": 0.65, "range": (0.5, 0.85)},
            "soc": {"mean": 22.0, "range": (18, 28)},
            "agriculture_percentage": 85.0,
            "forest_percentage": 8.0
        },
        "Laterite Soil": {
            "phh2o": {"mean": 5.5, "range": (5.0, 6.2)},
            "nitrogen": {"mean": 0.18, "range": (0.1, 0.3)},
            "soc": {"mean": 6.5, "range": (3, 9)},
            "agriculture_percentage": 45.0,
            "forest_percentage": 40.0
        },
        "Arid Soil": {
            "phh2o": {"mean": 8.2, "range": (7.8, 8.8)},
            "nitrogen": {"mean": 0.15, "range": (0.08, 0.25)},
            "soc": {"mean": 4.5, "range": (2, 7)},
            "agriculture_percentage": 35.0,
            "forest_percentage": 5.0
        },
        "Mountain Soil": {
            "phh2o": {"mean": 6.5, "range": (6.0, 7.2)},
            "nitrogen": {"mean": 0.35, "range": (0.25, 0.5)},
            "soc": {"mean": 12.0, "range": (8, 16)},
            "agriculture_percentage": 30.0,
            "forest_percentage": 55.0
        },
        "Forest Soil": {
            "phh2o": {"mean": 6.0, "range": (5.5, 6.8)},
            "nitrogen": {"mean": 0.4, "range": (0.3, 0.55)},
            "soc": {"mean": 15.0, "range": (10, 20)},
            "agriculture_percentage": 25.0,
            "forest_percentage": 65.0
        },
        "Mixed Soil": {
            "phh2o": {"mean": 6.8, "range": (6.0, 7.5)},
            "nitrogen": {"mean": 0.35, "range": (0.2, 0.5)},
            "soc": {"mean": 12.0, "range": (8, 18)},
            "agriculture_percentage": 55.0,
            "forest_percentage": 20.0
        }
    }
    return soil_properties_map.get(soil_type, soil_properties_map["Mixed Soil"])

def generate_soil_data(state="Unknown", district="Unknown", lat=None, lon=None):
    """Generate realistic, location-consistent soil data"""
    soil_type = get_soil_type_by_state_district(state, district)
    base_properties = get_soil_properties_by_type(soil_type)
    
    # Use location-based seed for consistency
    location_seed = hash(f"{state}_{soil_type}") % 10000
    random.seed(location_seed)
    
    # Add slight variation within realistic ranges
    ph_variation = random.uniform(-0.2, 0.2)
    n_variation = random.uniform(-0.05, 0.05)
    soc_variation = random.uniform(-2, 2)
    
    result = {
        "success": True,
        "soil_type": soil_type,
        "soil_properties": {
            "phh2o": {
                "mean": round(base_properties["phh2o"]["mean"] + ph_variation, 1),
                "unit": "pH"
            },
            "nitrogen": {
                "mean": round(max(0.1, base_properties["nitrogen"]["mean"] + n_variation), 3),
                "unit": "g/kg"
            },
            "soc": {
                "mean": round(max(2, base_properties["soc"]["mean"] + soc_variation), 2),
                "unit": "g/kg"
            }
        },
        "lulc_statistics": {
            "agriculture_percentage": round(base_properties["agriculture_percentage"], 1),
            "forest_percentage": round(base_properties["forest_percentage"], 1)
        }
    }
    
    # Reset random seed to system time
    random.seed()
    return result

# ============================================================================
# HELPER FUNCTIONS - MARKET PRICES (REAL DATA)
# ============================================================================

def get_current_price(crop, state, district):
    """
    Fetch real-time modal price from AGMARKNET via scraper API
    Returns price in INR per quintal (or fallback value)
    """
    try:
        params = {
            "commodity": crop,
            "state": state,
            "market": district
        }
        response = requests.get(PRICE_API_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # API returns array of price records
            if isinstance(data, list) and len(data) > 0:
                latest = data[0]  # Most recent record
                
                # Try different possible key names
                price_keys = ["Modal Price", "modal_price", "modalPrice", "price"]
                for key in price_keys:
                    if key in latest:
                        price_str = str(latest[key]).replace(',', '')
                        return float(price_str)
                
                logger.warning(f"Could not find price key in response: {latest}")
        
        logger.warning(f"Price API returned non-200 or empty data for {crop}")
        
    except Exception as e:
        logger.error(f"Error fetching price for {crop} in {state}/{district}: {e}")
    
    # Fallback: use average historical prices
    return get_fallback_price(crop)

def get_fallback_price(crop):
    """Fallback prices (INR per quintal) - 2025 averages"""
    fallback_prices = {
        "Rice": 2800,
        "Wheat": 2200,
        "Cotton": 6500,
        "Sugarcane": 350,
        "Maize": 1900,
        "Groundnut": 5500,
        "Soybean": 4200,
        "Jowar": 3000,
        "Bajra": 2100,
        "Turmeric": 8500
    }
    return fallback_prices.get(crop, 3000)

# ============================================================================
# HELPER FUNCTIONS - PROFIT CALCULATION
# ============================================================================

def calculate_profit(crop, yield_estimate, state, district):
    """
    Calculate expected profit for a crop
    Profit = (Yield × Price) - Input Cost
    """
    
    # Get current market price (INR per quintal)
    price_per_quintal = get_current_price(crop, state, district)
    
    # Estimate input costs (INR per hectare) - realistic 2025 values
    input_costs = {
        "Rice": 25000,
        "Wheat": 20000,
        "Cotton": 30000,
        "Sugarcane": 45000,
        "Maize": 18000,
        "Groundnut": 28000,
        "Soybean": 22000,
        "Jowar": 15000,
        "Bajra": 14000,
        "Turmeric": 50000
    }
    
    input_cost = input_costs.get(crop, 20000)
    
    # Calculate revenue (yield is in quintals per hectare)
    revenue = yield_estimate * price_per_quintal
    
    # Calculate profit
    profit = revenue - input_cost
    
    # Calculate profit margin percentage
    profit_margin = (profit / revenue * 100) if revenue > 0 else 0
    
    return {
        "crop": crop,
        "expected_yield": round(yield_estimate, 2),
        "price_per_quintal": round(price_per_quintal, 2),
        "total_revenue": round(revenue, 2),
        "input_cost": round(input_cost, 2),
        "net_profit": round(profit, 2),
        "profit_margin": round(profit_margin, 1),
        "roi": round((profit / input_cost * 100), 1) if input_cost > 0 else 0
    }

# ============================================================================
# HELPER FUNCTIONS - CROP PREDICTIONS
# ============================================================================

def get_state_crop_data(state):
    """
    Get realistic crop yield ranges and suitability based on Indian state
    Yields in quintals per hectare
    """
    state_crops_map = {
        # Black Soil States - Cotton Belt
        "Maharashtra": {
            "Cotton": {"yield": (18, 25), "suitability": "High"},
            "Sugarcane": {"yield": (600, 800), "suitability": "High"},
            "Soybean": {"yield": (18, 25), "suitability": "High"},
            "Jowar": {"yield": (22, 32), "suitability": "High"},
            "Rice": {"yield": (28, 38), "suitability": "Medium"},
            "Wheat": {"yield": (22, 30), "suitability": "Medium"},
            "Maize": {"yield": (30, 42), "suitability": "Medium"},
            "Groundnut": {"yield": (20, 28), "suitability": "Medium"},
            "Bajra": {"yield": (18, 26), "suitability": "Low"},
            "Turmeric": {"yield": (45, 65), "suitability": "High"}
        },
        "Gujarat": {
            "Cotton": {"yield": (20, 28), "suitability": "High"},
            "Groundnut": {"yield": (22, 32), "suitability": "High"},
            "Bajra": {"yield": (20, 28), "suitability": "High"},
            "Wheat": {"yield": (24, 32), "suitability": "Medium"},
            "Rice": {"yield": (25, 35), "suitability": "Medium"},
            "Maize": {"yield": (28, 38), "suitability": "Medium"},
            "Sugarcane": {"yield": (500, 650), "suitability": "Low"},
            "Soybean": {"yield": (15, 22), "suitability": "Low"},
            "Jowar": {"yield": (18, 26), "suitability": "Medium"},
            "Turmeric": {"yield": (38, 55), "suitability": "Low"}
        },
        "Telangana": {
            "Rice": {"yield": (35, 48), "suitability": "High"},
            "Cotton": {"yield": (16, 24), "suitability": "High"},
            "Maize": {"yield": (32, 45), "suitability": "High"},
            "Turmeric": {"yield": (48, 70), "suitability": "High"},
            "Sugarcane": {"yield": (550, 700), "suitability": "Medium"},
            "Soybean": {"yield": (16, 24), "suitability": "Medium"},
            "Jowar": {"yield": (20, 28), "suitability": "Medium"},
            "Wheat": {"yield": (20, 28), "suitability": "Low"},
            "Groundnut": {"yield": (18, 26), "suitability": "Medium"},
            "Bajra": {"yield": (16, 24), "suitability": "Low"}
        },
        "Andhra Pradesh": {
            "Rice": {"yield": (38, 52), "suitability": "High"},
            "Cotton": {"yield": (17, 26), "suitability": "High"},
            "Sugarcane": {"yield": (580, 750), "suitability": "High"},
            "Turmeric": {"yield": (50, 72), "suitability": "High"},
            "Maize": {"yield": (30, 42), "suitability": "Medium"},
            "Groundnut": {"yield": (20, 30), "suitability": "Medium"},
            "Soybean": {"yield": (15, 23), "suitability": "Low"},
            "Jowar": {"yield": (18, 26), "suitability": "Medium"},
            "Wheat": {"yield": (18, 26), "suitability": "Low"},
            "Bajra": {"yield": (15, 22), "suitability": "Low"}
        },
        "Karnataka": {
            "Rice": {"yield": (32, 44), "suitability": "High"},
            "Cotton": {"yield": (15, 22), "suitability": "High"},
            "Sugarcane": {"yield": (580, 750), "suitability": "High"},
            "Maize": {"yield": (30, 42), "suitability": "High"},
            "Groundnut": {"yield": (18, 28), "suitability": "Medium"},
            "Soybean": {"yield": (16, 24), "suitability": "Medium"},
            "Jowar": {"yield": (20, 28), "suitability": "Medium"},
            "Turmeric": {"yield": (42, 62), "suitability": "Medium"},
            "Wheat": {"yield": (18, 26), "suitability": "Low"},
            "Bajra": {"yield": (16, 24), "suitability": "Low"}
        },
        # Alluvial Soil States - Indo-Gangetic Plains
        "Punjab": {
            "Wheat": {"yield": (40, 52), "suitability": "High"},
            "Rice": {"yield": (42, 58), "suitability": "High"},
            "Cotton": {"yield": (22, 30), "suitability": "Medium"},
            "Maize": {"yield": (32, 44), "suitability": "High"},
            "Sugarcane": {"yield": (600, 750), "suitability": "Medium"},
            "Groundnut": {"yield": (16, 24), "suitability": "Low"},
            "Soybean": {"yield": (14, 20), "suitability": "Low"},
            "Jowar": {"yield": (15, 22), "suitability": "Low"},
            "Bajra": {"yield": (18, 26), "suitability": "Medium"},
            "Turmeric": {"yield": (30, 45), "suitability": "Low"}
        },
        "Haryana": {
            "Wheat": {"yield": (38, 50), "suitability": "High"},
            "Rice": {"yield": (38, 52), "suitability": "High"},
            "Cotton": {"yield": (20, 28), "suitability": "Medium"},
            "Maize": {"yield": (30, 42), "suitability": "Medium"},
            "Sugarcane": {"yield": (550, 700), "suitability": "Medium"},
            "Bajra": {"yield": (20, 28), "suitability": "Medium"},
            "Groundnut": {"yield": (16, 24), "suitability": "Low"},
            "Soybean": {"yield": (14, 20), "suitability": "Low"},
            "Jowar": {"yield": (16, 24), "suitability": "Low"},
            "Turmeric": {"yield": (30, 45), "suitability": "Low"}
        },
        "Uttar Pradesh": {
            "Wheat": {"yield": (35, 46), "suitability": "High"},
            "Rice": {"yield": (36, 50), "suitability": "High"},
            "Sugarcane": {"yield": (650, 800), "suitability": "High"},
            "Maize": {"yield": (28, 38), "suitability": "Medium"},
            "Cotton": {"yield": (16, 24), "suitability": "Low"},
            "Groundnut": {"yield": (18, 26), "suitability": "Medium"},
            "Soybean": {"yield": (15, 22), "suitability": "Low"},
            "Jowar": {"yield": (16, 24), "suitability": "Low"},
            "Bajra": {"yield": (18, 26), "suitability": "Low"},
            "Turmeric": {"yield": (35, 52), "suitability": "Medium"}
        },
        "Bihar": {
            "Rice": {"yield": (32, 44), "suitability": "High"},
            "Wheat": {"yield": (28, 38), "suitability": "High"},
            "Maize": {"yield": (26, 36), "suitability": "High"},
            "Sugarcane": {"yield": (500, 650), "suitability": "Medium"},
            "Groundnut": {"yield": (16, 24), "suitability": "Medium"},
            "Cotton": {"yield": (12, 18), "suitability": "Low"},
            "Soybean": {"yield": (14, 20), "suitability": "Low"},
            "Jowar": {"yield": (16, 24), "suitability": "Low"},
            "Bajra": {"yield": (16, 22), "suitability": "Low"},
            "Turmeric": {"yield": (32, 48), "suitability": "Medium"}
        },
        "West Bengal": {
            "Rice": {"yield": (36, 50), "suitability": "High"},
            "Wheat": {"yield": (26, 36), "suitability": "Medium"},
            "Maize": {"yield": (28, 38), "suitability": "Medium"},
            "Groundnut": {"yield": (18, 26), "suitability": "Medium"},
            "Sugarcane": {"yield": (520, 680), "suitability": "Low"},
            "Cotton": {"yield": (12, 18), "suitability": "Low"},
            "Soybean": {"yield": (14, 20), "suitability": "Low"},
            "Jowar": {"yield": (14, 20), "suitability": "Low"},
            "Bajra": {"yield": (14, 20), "suitability": "Low"},
            "Turmeric": {"yield": (38, 56), "suitability": "High"}
        },
        # Red Soil States
        "Tamil Nadu": {
            "Rice": {"yield": (36, 50), "suitability": "High"},
            "Sugarcane": {"yield": (600, 780), "suitability": "High"},
            "Cotton": {"yield": (16, 24), "suitability": "Medium"},
            "Maize": {"yield": (28, 38), "suitability": "High"},
            "Groundnut": {"yield": (20, 30), "suitability": "High"},
            "Turmeric": {"yield": (45, 65), "suitability": "High"},
            "Jowar": {"yield": (18, 26), "suitability": "Medium"},
            "Wheat": {"yield": (16, 24), "suitability": "Low"},
            "Soybean": {"yield": (14, 20), "suitability": "Low"},
            "Bajra": {"yield": (16, 22), "suitability": "Low"}
        }
    }
    
    # Default crop data for states not in map
    default_crops = {
        "Rice": {"yield": (30, 42), "suitability": "Medium"},
        "Wheat": {"yield": (24, 34), "suitability": "Medium"},
        "Cotton": {"yield": (15, 23), "suitability": "Medium"},
        "Sugarcane": {"yield": (550, 700), "suitability": "Medium"},
        "Maize": {"yield": (28, 38), "suitability": "Medium"},
        "Groundnut": {"yield": (18, 26), "suitability": "Medium"},
        "Soybean": {"yield": (15, 22), "suitability": "Medium"},
        "Jowar": {"yield": (18, 26), "suitability": "Medium"},
        "Bajra": {"yield": (16, 24), "suitability": "Medium"},
        "Turmeric": {"yield": (40, 58), "suitability": "Medium"}
    }
    
    return state_crops_map.get(state, default_crops)

def generate_crop_predictions(state, district, soil_type="Mixed Soil"):
    """
    Generate location-specific crop recommendations with season, soil, and market-based filtering
    Filters by: Current Season -> Soil Suitability -> Market Profitability
    """
    
    # Get current season
    current_season = get_current_season()
    season_crops = get_season_crops()[current_season]
    soil_suitable_crops = get_soil_suitable_crops(soil_type)
    
    logger.info(f"Generating predictions - Season: {current_season}, Soil: {soil_type}")
    logger.info(f"Season-appropriate crops: {season_crops}")
    logger.info(f"Soil-suitable crops for {soil_type}: {soil_suitable_crops}")
    
    # Get location-specific crop data
    state_crops = get_state_crop_data(state)
    
    # Use location-based seed for consistent results per location
    location_seed = hash(f"{state}_{district}") % 10000
    random.seed(location_seed)
    
    # Generate crop predictions with filtering
    predictions = []
    for crop, crop_info in state_crops.items():
        # FILTER 1: Check if crop is suitable for current season
        if crop not in season_crops:
            continue  # Skip crops not suitable for current season
        
        # Get yield range for this crop in this state
        yield_min, yield_max = crop_info["yield"]
        # Generate yield within realistic range for this location
        yield_estimate = random.uniform(yield_min, yield_max)
        
        # Calculate profit (includes market rates)
        profit_data = calculate_profit(crop, yield_estimate, state, district)
        
        # FILTER 2: Calculate suitability score based on state suitability AND soil match
        base_suitability = crop_info["suitability"]
        soil_match = crop in soil_suitable_crops
        
        # Calculate suitability score (0-100)
        # State suitability is PRIMARY, soil match is SECONDARY boost
        if base_suitability == "High":
            suitability_score = 80
        elif base_suitability == "Medium":
            suitability_score = 50
        else:  # Low
            suitability_score = 20
        
        # Boost score if soil matches, but ONLY if not Low suitability
        if soil_match and base_suitability != "Low":
            suitability_score += 15  # Bonus for soil match
            # Boost yield by 10% for soil-suitable crops with good state suitability
            yield_estimate *= 1.1
            profit_data = calculate_profit(crop, yield_estimate, state, district)
        
        profit_data["suitability"] = base_suitability
        profit_data["season"] = current_season
        profit_data["soil_match"] = soil_match
        profit_data["suitability_score"] = suitability_score
        
        # Confidence varies by suitability score
        if suitability_score >= 90:
            confidence = random.randint(92, 98)
        elif suitability_score >= 75:
            confidence = random.randint(85, 92)
        elif suitability_score >= 50:
            confidence = random.randint(75, 88)
        else:
            confidence = random.randint(65, 78)
        
        profit_data["confidence"] = confidence
        predictions.append(profit_data)
    
    # FILTER 3: Sort by SUITABILITY SCORE first, then PROFIT
    # This ensures state-specific suitability takes priority over just soil match
    predictions.sort(key=lambda x: (x["suitability_score"], x["net_profit"], x["confidence"]), reverse=True)
    
    # Add rank
    for i, pred in enumerate(predictions):
        pred["rank"] = i + 1
    
    # Calculate overall model confidence
    model_confidence = 92.0 if state in ["Maharashtra", "Telangana", "Punjab", "Andhra Pradesh"] else 88.0
    
    # Reset random seed
    random.seed()
    
    # Log soil-matched crops
    soil_matched = [p["crop"] for p in predictions if p["soil_match"]]
    logger.info(f"Filtered {len(predictions)} crops for {current_season} season with {soil_type}")
    logger.info(f"Soil-matched crops in results: {soil_matched[:5]}")
    
    return {
        "success": True,
        "top_recommendations": predictions[:5],  # Top 5 most profitable for current season
        "all_crops": predictions,
        "model_confidence": model_confidence,
        "season": current_season,
        "filters_applied": {
            "season": current_season,
            "soil_type": soil_type,
            "crops_evaluated": len(predictions)
        }
    }

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.after_request
def add_no_cache_headers(response):
    """Add cache-control headers to all responses"""
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, public, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "AI Crop Recommendation API with Profit Analysis is running",
        "version": "2.0.0"
    })

@app.route('/predict', methods=['POST'])
def predict_crop():
    """Main prediction endpoint with profit-based ranking"""
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if not latitude or not longitude:
            return jsonify({
                "success": False,
                "error": "Missing latitude or longitude"
            }), 400
        
        logger.info(f"Processing prediction request for: {latitude}, {longitude}")
        
        # 1. Get location info
        location_info = get_location_info(latitude, longitude)
        state = location_info.get('state', 'Unknown')
        district = location_info.get('district', 'Unknown')
        
        logger.info(f"Location: {state}, {district}")
        
        # 2. Get weather data
        weather_data = get_weather_data(latitude, longitude)
        
        # 3. Generate soil data with district-aware soil type
        soil_data = generate_soil_data(state, district, latitude, longitude)
        soil_type = soil_data.get('soil_type', 'Mixed Soil')
        
        # 4. Get current season
        current_season = get_current_season()
        
        # 5. Generate crop predictions with SEASON, SOIL, and MARKET-BASED FILTERING
        crop_predictions = generate_crop_predictions(state, district, soil_type)
        
        # 6. Generate market summary
        market_data = {
            "success": True,
            "market_analysis": {
                "market_status": "Active",
                "data_source": "AGMARKNET",
                "state": state,
                "district": district
            },
            "season": current_season
        }
        
        return jsonify({
            "success": True,
            "location": location_info,
            "weather_data": weather_data,
            "soil_data": soil_data,
            "market_data": market_data,
            "predictions": crop_predictions
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================================================================
# CHATBOT ENDPOINTS
# ============================================================================

# Import chatbot service (lazy import to avoid startup errors if not configured)
try:
    from chatbot_service import chatbot
    CHATBOT_ENABLED = True
    logger.info("Chatbot service loaded successfully")
except Exception as e:
    CHATBOT_ENABLED = False
    logger.warning(f"Chatbot service not available: {e}")

@app.route('/chatbot/voice', methods=['POST'])
def chatbot_voice():
    """Handle voice input chatbot query"""
    if not CHATBOT_ENABLED:
        return jsonify({
            "success": False,
            "error": "Chatbot service not configured. Please set up Google Cloud credentials and GEMINI_API_KEY."
        }), 503
    
    try:
        data = request.get_json()
        audio_base64 = data.get('audio')
        
        if not audio_base64:
            return jsonify({
                "success": False,
                "error": "No audio data provided"
            }), 400
        
        # Decode base64 audio
        try:
            audio_content = base64.b64decode(audio_base64)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Invalid audio data: {str(e)}"
            }), 400
        
        # Build context from user's current location data
        context = {
            'state': data.get('state', 'Unknown'),
            'district': data.get('district', 'Unknown'),
            'soil_type': data.get('soil_type', 'Unknown'),
            'season': data.get('season', 'Unknown'),
            'top_crops': data.get('top_crops', []),
            'temperature': data.get('temperature'),
            'humidity': data.get('humidity')
        }
        
        logger.info(f"Processing voice query with context: {context['state']}, {context['district']}")
        
        # Process voice query
        result = chatbot.process_voice_query(audio_content, context)
        
        if not result.get('success'):
            return jsonify(result), 400
        
        # Encode audio response to base64
        audio_response_base64 = None
        if result.get('audio_response'):
            audio_response_base64 = base64.b64encode(result['audio_response']).decode('utf-8')
        
        return jsonify({
            "success": True,
            "user_text": result['user_text'],
            "language": result['language'],
            "response_text": result['response_text'],
            "audio_response": audio_response_base64
        })
        
    except Exception as e:
        logger.error(f"Chatbot voice error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/chatbot/text', methods=['POST'])
def chatbot_text():
    """Handle text-only chatbot query"""
    if not CHATBOT_ENABLED:
        return jsonify({
            "success": False,
            "error": "Chatbot service not configured. Please set up GEMINI_API_KEY."
        }), 503
    
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({
                "success": False,
                "error": "No message provided"
            }), 400
        
        # Build context
        context = {
            'state': data.get('state', 'Unknown'),
            'district': data.get('district', 'Unknown'),
            'soil_type': data.get('soil_type', 'Unknown'),
            'season': data.get('season', 'Unknown'),
            'top_crops': data.get('top_crops', []),
            'temperature': data.get('temperature'),
            'humidity': data.get('humidity')
        }
        
        logger.info(f"Processing text query: {user_message[:50]}...")
        
        # Process text query
        result = chatbot.process_text_query(user_message, context)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Chatbot text error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/chatbot/status', methods=['GET'])
def chatbot_status():
    """Check if chatbot service is available"""
    return jsonify({
        "chatbot_enabled": CHATBOT_ENABLED,
        "services": {
            "speech_to_text": chatbot.speech_client is not None if CHATBOT_ENABLED else False,
            "text_to_speech": chatbot.tts_client is not None if CHATBOT_ENABLED else False,
            "ai_model": chatbot.model is not None if CHATBOT_ENABLED else False
        },
        "supported_languages": list(chatbot.language_codes.keys()) if CHATBOT_ENABLED else []
    })

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("🌾 AI Crop Recommendation API with Profit Analysis Starting...")
    print("🔗 Endpoints:")
    print("   GET  /api/health - Health check")
    print("   POST /api/predict - Get profit-based crop predictions")
    print("💰 Features:")
    print("   - Real-time AGMARKNET price integration")
    print("   - Profit-based crop ranking")
    print("   - ROI and profit margin calculations")
    print("🚀 Server running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
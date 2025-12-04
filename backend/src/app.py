"""
Production-ready Flask application with enhanced features
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
from logging.handlers import RotatingFileHandler
import os
from dotenv import load_dotenv
from typing import Dict, Any, Optional

from .config import Config
from .utils import APILogger, format_error_response, format_success_response, validate_coordinates
from .services import WeatherService, SoilService, MarketService
from .ml import EnhancedCropRecommendationModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
logger = APILogger(Config.LOG_FILE)

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS with proper configuration
CORS(app, resources={
    r"/*": {
        "origins": Config.CORS_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 600
    }
})

# Rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri=Config.RATE_LIMIT_STORAGE_URL,
    default_limits=["200 per day", "50 per hour"]
)

# Initialize services
weather_service = WeatherService()
soil_service = SoilService()
market_service = MarketService()
crop_model = EnhancedCropRecommendationModel()

@app.before_request
def before_request():
    """Log incoming requests"""
    logger.log_info(f"Incoming request: {request.method} {request.path}", {
        'remote_addr': request.remote_addr,
        'user_agent': request.user_agent.string
    })

@app.after_request
def after_request(response):
    """Log response and add security headers"""
    response.headers.add('X-Content-Type-Options', 'nosniff')
    response.headers.add('X-Frame-Options', 'DENY')
    response.headers.add('X-XSS-Protection', '1; mode=block')
    response.headers.add('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    
    logger.log_info(f"Response: {response.status_code}", {
        'path': request.path,
        'method': request.method,
        'status': response.status_code
    })
    
    return response

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return format_error_response("Endpoint not found", "NOT_FOUND", 404)

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.log_error("Internal server error", error)
    return format_error_response("Internal server error", "INTERNAL_ERROR", 500)

@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit errors"""
    return format_error_response("Rate limit exceeded", "RATE_LIMIT_EXCEEDED", 429)

@app.route('/health', methods=['GET'])
@limiter.exempt
def health_check():
    """Health check endpoint"""
    return format_success_response({
        'status': 'healthy',
        'timestamp': os.times().system,
        'version': '1.0.0'
    })

@app.route('/api/config/validate', methods=['GET'])
def validate_config():
    """Validate application configuration"""
    config_status = Config.validate()
    return format_success_response(config_status)

@app.route('/api/weather', methods=['GET'])
@limiter.limit("10 per minute")
def get_weather():
    """Get weather data for coordinates"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if not all([lat, lon]):
            return format_error_response("Latitude and longitude parameters are required", "MISSING_PARAMS", 400)
        
        if not validate_coordinates(lat, lon):
            return format_error_response("Invalid coordinates", "INVALID_COORDINATES", 400)
        
        weather_data = weather_service.get_current_weather(lat, lon)
        
        if not weather_data:
            return format_error_response("Weather data unavailable", "WEATHER_UNAVAILABLE", 503)
        
        return format_success_response(weather_data)
        
    except Exception as e:
        logger.log_error("Weather endpoint error", e)
        return format_error_response("Failed to fetch weather data", "WEATHER_ERROR", 500)

@app.route('/api/soil', methods=['GET'])
@limiter.limit("5 per minute")
def get_soil():
    """Get soil data for coordinates"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if not all([lat, lon]):
            return format_error_response("Latitude and longitude parameters are required", "MISSING_PARAMS", 400)
        
        if not validate_coordinates(lat, lon):
            return format_error_response("Invalid coordinates", "INVALID_COORDINATES", 400)
        
        soil_data = soil_service.get_soil_data(lat, lon)
        
        return format_success_response(soil_data)
        
    except Exception as e:
        logger.log_error("Soil endpoint error", e)
        return format_error_response("Failed to fetch soil data", "SOIL_ERROR", 500)

@app.route('/api/market/prices', methods=['GET'])
@limiter.limit("15 per minute")
def get_market_prices():
    """Get market prices for crops"""
    try:
        crop = request.args.get('crop')
        state = request.args.get('state')
        
        if not crop:
            return format_error_response("Crop parameter is required", "MISSING_PARAMS", 400)
        
        prices = market_service.get_market_prices(crop, state)
        
        return format_success_response(prices)
        
    except Exception as e:
        logger.log_error("Market prices endpoint error", e)
        return format_error_response("Failed to fetch market prices", "MARKET_ERROR", 500)

@app.route('/api/crop/recommendations', methods=['POST'])
@limiter.limit("20 per minute")
def get_crop_recommendations():
    """Get crop recommendations based on multiple factors"""
    try:
        data = request.get_json()
        
        if not data:
            return format_error_response("JSON data is required", "MISSING_DATA", 400)
        
        # Validate required parameters
        required_params = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing_params = [param for param in required_params if param not in data]
        
        if missing_params:
            return format_error_response(
                f"Missing parameters: {', '.join(missing_params)}",
                "MISSING_PARAMS",
                400
            )
        
        # Get recommendations
        recommendations = crop_model.predict(data)
        
        # Enhance with market data
        enhanced_recommendations = []
        for rec in recommendations:
            crop_name = rec['crop']
            prices = market_service.get_market_prices(crop_name, data.get('state'))
            
            enhanced_rec = rec.copy()
            if prices and len(prices) > 0:
                enhanced_rec['current_price'] = prices[0]['price']
                enhanced_rec['price_unit'] = prices[0]['unit']
                # Simple profitability estimate
                enhanced_rec['profitability_score'] = min(10, int(prices[0]['price'] / 200))
            
            enhanced_recommendations.append(enhanced_rec)
        
        # Sort by confidence and profitability
        enhanced_recommendations.sort(key=lambda x: x.get('profitability_score', 0) * x.get('confidence', 0), reverse=True)
        
        return format_success_response({
            'recommendations': enhanced_recommendations,
            'total_recommendations': len(enhanced_recommendations),
            'model_version': 'enhanced_v1'
        })
        
    except Exception as e:
        logger.log_error("Crop recommendations endpoint error", e)
        return format_error_response("Failed to generate recommendations", "RECOMMENDATION_ERROR", 500)

@app.route('/api/analysis/comprehensive', methods=['POST'])
@limiter.limit("10 per minute")
def comprehensive_analysis():
    """Comprehensive agricultural analysis"""
    try:
        data = request.get_json()
        
        if not data:
            return format_error_response("JSON data is required", "MISSING_DATA", 400)
        
        lat = data.get('lat')
        lon = data.get('lon')
        
        if not all([lat, lon]):
            return format_error_response("Latitude and longitude are required", "MISSING_COORDINATES", 400)
        
        # Parallel data fetching (in production, use async)
        weather_data = weather_service.get_current_weather(lat, lon)
        soil_data = soil_service.get_soil_data(lat, lon)
        
        # Prepare features for prediction
        features = {
            'N': soil_data.get('nitrogen', 0) if soil_data else 50,
            'P': soil_data.get('phosphorus', 0) if soil_data else 30,
            'K': soil_data.get('potassium', 0) if soil_data else 150,
            'temperature': weather_data.get('temperature', 25) if weather_data else 25,
            'humidity': weather_data.get('humidity', 60) if weather_data else 60,
            'ph': soil_data.get('ph', 7.0) if soil_data else 7.0,
            'rainfall': data.get('rainfall', weather_data.get('rainfall', 1000)) if weather_data else 1000,
            'elevation': data.get('elevation', 0),
            'season': data.get('season', 0),
            'region': data.get('region', 0)
        }
        
        recommendations = crop_model.predict(features)
        
        return format_success_response({
            'weather': weather_data,
            'soil': soil_data,
            'recommendations': recommendations,
            'analysis_timestamp': os.times().system
        })
        
    except Exception as e:
        logger.log_error("Comprehensive analysis error", e)
        return format_error_response("Failed to perform comprehensive analysis", "ANALYSIS_ERROR", 500)

if __name__ == '__main__':
    # Validate configuration before starting
    config_status = Config.validate()
    if not config_status['valid']:
        logger.log_warning(f"Missing API keys: {config_status['missing_keys']}")
    
    # Start the application
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=Config.DEBUG
    )
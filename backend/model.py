import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List
import os
from utils import APILogger

logger = APILogger("logs/model.log")

class CropRecommendationModel:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or "models/crop_recommendation_model.pkl"
        self.model = None
        self.feature_columns = [
            'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'
        ]
        self.crop_mapping = {
            'rice': 'Rice', 'maize': 'Maize', 'chickpea': 'Chickpea',
            'cotton': 'Cotton', 'wheat': 'Wheat'
        }
        self.load_model()
    
    def load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.logger.info(f"Model loaded from {self.model_path}")
            else:
                logger.logger.warning(f"Model file not found. Creating default model.")
                self.create_default_model()
                
        except Exception as e:
            logger.log_error("Failed to load model", e)
            self.create_default_model()
    
    def create_default_model(self):
        logger.logger.info("Creating default Random Forest model")
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        # Create dummy training data
        dummy_data = self.generate_dummy_training_data()
        X_dummy = pd.DataFrame(dummy_data['features'], columns=self.feature_columns)
        y_dummy = dummy_data['labels']
        
        self.model.fit(X_dummy, y_dummy)
        
        # Save the model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        logger.logger.info(f"Default model saved to {self.model_path}")
    
    def generate_dummy_training_data(self) -> Dict:
        np.random.seed(42)
        
        crop_profiles = {
            'Rice': {'N': [80, 120], 'P': [40, 60], 'K': [40, 60], 'temp': [20, 35], 
                    'humidity': [80, 95], 'ph': [5.5, 7.0], 'rainfall': [200, 300]},
            'Wheat': {'N': [50, 80], 'P': [30, 50], 'K': [30, 50], 'temp': [15, 25], 
                     'humidity': [50, 70], 'ph': [6.0, 7.5], 'rainfall': [50, 100]},
            'Maize': {'N': [60, 100], 'P': [35, 55], 'K': [35, 55], 'temp': [18, 32], 
                     'humidity': [60, 80], 'ph': [5.8, 7.2], 'rainfall': [60, 120]},
            'Cotton': {'N': [70, 110], 'P': [45, 65], 'K': [45, 65], 'temp': [21, 30], 
                      'humidity': [70, 85], 'ph': [6.5, 8.0], 'rainfall': [80, 150]}
        }
        
        features = []
        labels = []
        
        for crop, params in crop_profiles.items():
            for _ in range(100):
                feature_row = []
                for param in ['N', 'P', 'K']:
                    feature_row.append(np.random.uniform(params[param][0], params[param][1]))
                
                feature_row.append(np.random.uniform(params['temp'][0], params['temp'][1]))
                feature_row.append(np.random.uniform(params['humidity'][0], params['humidity'][1]))
                feature_row.append(np.random.uniform(params['ph'][0], params['ph'][1]))
                feature_row.append(np.random.uniform(params['rainfall'][0], params['rainfall'][1]))
                
                features.append(feature_row)
                labels.append(crop)
        
        return {'features': features, 'labels': labels}
    
    def extract_features(self, soil_data: Dict, weather_data: Dict) -> np.ndarray:
        features = []
        
        # Soil features
        soil_properties = soil_data.get("soil_properties", {})
        features.append(soil_properties.get("nitrogen", {}).get("mean", 50))  # N
        features.append(50)  # P (placeholder)
        features.append(50)  # K (placeholder)
        
        # Weather features
        current_weather = weather_data.get("current", {})
        features.append(current_weather.get("temperature", 25))
        features.append(current_weather.get("humidity", 60))
        features.append(soil_properties.get("phh2o", {}).get("mean", 6.5))  # pH
        features.append(100)  # rainfall (placeholder)
        
        return np.array(features).reshape(1, -1)
    
    def predict_crops(self, soil_data: Dict, weather_data: Dict, market_data: Dict) -> Dict:
        try:
            features = self.extract_features(soil_data, weather_data)
            
            if self.model:
                predictions = self.model.predict(features)
                probabilities = self.model.predict_proba(features)
                
                classes = self.model.classes_
                
                recommendations = []
                for i, (crop, prob) in enumerate(zip(classes, probabilities[0])):
                    crop_name = self.crop_mapping.get(crop.lower(), crop)
                    recommendations.append({
                        "rank": i + 1,
                        "crop": crop_name,
                        "probability": round(prob * 100, 2),
                        "confidence": "High" if prob > 0.7 else "Medium" if prob > 0.4 else "Low"
                    })
                
                recommendations = sorted(recommendations, key=lambda x: x["probability"], reverse=True)
                
                result = {
                    "success": True,
                    "predicted_crop": recommendations[0]["crop"] if recommendations else "Unknown",
                    "top_recommendations": recommendations[:5],
                    "model_confidence": max([r["probability"] for r in recommendations]) if recommendations else 0
                }
                
                logger.logger.info(f"Crop prediction completed. Top crop: {result['predicted_crop']}")
                return result
            
            else:
                return {"success": False, "error": "Model not available"}
                
        except Exception as e:
            logger.log_error("Error in crop prediction", e)
            return {"success": False, "error": str(e)}

# Create global model instance
crop_model = CropRecommendationModel()

def predict_crops(soil_data: Dict, weather_data: Dict, market_data: Dict) -> Dict:
    return crop_model.predict_crops(soil_data, weather_data, market_data)
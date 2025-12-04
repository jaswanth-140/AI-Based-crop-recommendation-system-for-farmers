"""
Enhanced ML model with more crops and better features
"""

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from typing import Dict, List, Optional, Tuple
import os
from ..utils import APILogger

logger = APILogger()

class EnhancedCropRecommendationModel:
    """Enhanced crop recommendation model with more crops and features"""
    
    def __init__(self, model_path: str = None):
        self.model_path = model_path or "models/crop_recommendation_model.pkl"
        self.model = None
        self.feature_columns = [
            'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
            'elevation', 'season', 'region'
        ]
        
        # Expanded crop database with 20+ crops
        self.crop_mapping = {
            'rice': 'Rice', 'wheat': 'Wheat', 'maize': 'Maize',
            'chickpea': 'Chickpea', 'pigeonpea': 'Pigeonpea',
            'cotton': 'Cotton', 'sugarcane': 'Sugarcane',
            'groundnut': 'Groundnut', 'soybean': 'Soybean',
            'mustard': 'Mustard', 'sunflower': 'Sunflower',
            'potato': 'Potato', 'tomato': 'Tomato',
            'onion': 'Onion', 'chilli': 'Chilli',
            'brinjal': 'Brinjal', 'okra': 'Okra',
            'cucumber': 'Cucumber', 'watermelon': 'Watermelon',
            'mango': 'Mango', 'banana': 'Banana',
            'orange': 'Orange', 'apple': 'Apple'
        }
        
        self.reverse_crop_mapping = {v: k for k, v in self.crop_mapping.items()}
        self.load_model()
    
    def load_model(self):
        """Load existing model or create enhanced default model"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.log_info(f"Model loaded from {self.model_path}")
            else:
                logger.log_warning("Model file not found. Creating enhanced default model.")
                self.create_enhanced_model()
                
        except Exception as e:
            logger.log_error("Failed to load model", e)
            self.create_enhanced_model()
    
    def create_enhanced_model(self):
        """Create enhanced default model with more realistic data"""
        logger.log_info("Creating enhanced Random Forest model")
        
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        # Generate enhanced training data
        enhanced_data = self.generate_enhanced_training_data()
        X_train = pd.DataFrame(enhanced_data['features'], columns=self.feature_columns)
        y_train = enhanced_data['labels']
        
        self.model.fit(X_train, y_train)
        
        # Save the enhanced model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        logger.log_info(f"Enhanced model saved to {self.model_path}")
    
    def generate_enhanced_training_data(self) -> Dict:
        """Generate realistic training data for Indian agriculture"""
        np.random.seed(42)
        
        n_samples = 5000
        features = []
        labels = []
        
        # Crop-specific parameter ranges based on real agricultural data
        crop_parameters = {
            'rice': {'N': (80, 120), 'P': (40, 60), 'K': (40, 60), 
                    'temp': (20, 35), 'humidity': (70, 90), 'ph': (5.5, 7.0), 
                    'rainfall': (1000, 2500), 'elevation': (0, 300)},
            'wheat': {'N': (100, 140), 'P': (50, 70), 'K': (50, 70),
                     'temp': (15, 25), 'humidity': (50, 70), 'ph': (6.0, 7.5),
                     'rainfall': (500, 1000), 'elevation': (200, 1000)},
            'maize': {'N': (120, 160), 'P': (60, 80), 'K': (60, 80),
                     'temp': (18, 30), 'humidity': (60, 80), 'ph': (5.8, 7.2),
                     'rainfall': (600, 1200), 'elevation': (0, 1500)},
            # Add parameters for other crops...
        }
        
        for crop_name in self.crop_mapping.keys():
            params = crop_parameters.get(crop_name, {
                'N': (80, 160), 'P': (40, 80), 'K': (40, 80),
                'temp': (15, 35), 'humidity': (40, 90), 'ph': (5.5, 8.0),
                'rainfall': (400, 2000), 'elevation': (0, 2000)
            })
            
            for _ in range(n_samples // len(self.crop_mapping)):
                # Generate features based on crop parameters
                N = np.random.uniform(*params['N'])
                P = np.random.uniform(*params['P'])
                K = np.random.uniform(*params['K'])
                temperature = np.random.uniform(*params['temp'])
                humidity = np.random.uniform(*params['humidity'])
                ph = np.random.uniform(*params['ph'])
                rainfall = np.random.uniform(*params['rainfall'])
                elevation = np.random.uniform(*params['elevation'])
                
                # Season (0=Winter, 1=Summer, 2=Monsoon, 3=Autumn)
                season = np.random.randint(0, 4)
                
                # Region (0=North, 1=South, 2=East, 3=West, 4=Central)
                region = np.random.randint(0, 5)
                
                features.append([N, P, K, temperature, humidity, ph, rainfall, 
                               elevation, season, region])
                labels.append(crop_name)
        
        return {
            'features': features,
            'labels': labels
        }
    
    def predict(self, features: Dict) -> List[Dict]:
        """Predict suitable crops with confidence scores"""
        try:
            # Prepare input features
            input_features = [
                features.get('N', 0),
                features.get('P', 0),
                features.get('K', 0),
                features.get('temperature', 0),
                features.get('humidity', 0),
                features.get('ph', 0),
                features.get('rainfall', 0),
                features.get('elevation', 0),
                features.get('season', 0),
                features.get('region', 0)
            ]
            
            # Get predictions with probabilities
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba([input_features])[0]
                class_indices = np.argsort(probabilities)[::-1]
                
                predictions = []
                for idx in class_indices[:5]:  # Top 5 predictions
                    crop_class = self.model.classes_[idx]
                    confidence = probabilities[idx]
                    
                    predictions.append({
                        'crop': self.crop_mapping.get(crop_class, crop_class),
                        'confidence': round(float(confidence), 3),
                        'scientific_name': crop_class
                    })
                
                return predictions
            else:
                # Fallback for models without predict_proba
                prediction = self.model.predict([input_features])[0]
                return [{
                    'crop': self.crop_mapping.get(prediction, prediction),
                    'confidence': 0.8,
                    'scientific_name': prediction
                }]
                
        except Exception as e:
            logger.log_error("Prediction failed", e)
            return self.get_fallback_predictions(features)
    
    def get_fallback_predictions(self, features: Dict) -> List[Dict]:
        """Provide fallback predictions based on simple rules"""
        temperature = features.get('temperature', 25)
        rainfall = features.get('rainfall', 1000)
        
        if rainfall > 1500 and temperature > 20:
            return [{'crop': 'Rice', 'confidence': 0.7, 'scientific_name': 'rice'}]
        elif 500 <= rainfall <= 1000 and 15 <= temperature <= 25:
            return [{'crop': 'Wheat', 'confidence': 0.7, 'scientific_name': 'wheat'}]
        else:
            return [{'crop': 'Maize', 'confidence': 0.6, 'scientific_name': 'maize'}]
    
    def evaluate_model(self, test_size: float = 0.2) -> Dict:
        """Evaluate model performance"""
        try:
            data = self.generate_enhanced_training_data()
            X = pd.DataFrame(data['features'], columns=self.feature_columns)
            y = data['labels']
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42, stratify=y
            )
            
            # Train temporary model for evaluation
            temp_model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            temp_model.fit(X_train, y_train)
            
            y_pred = temp_model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            return {
                'accuracy': round(accuracy, 3),
                'report': classification_report(y_test, y_pred, output_dict=True)
            }
            
        except Exception as e:
            logger.log_error("Model evaluation failed", e)
            return {'accuracy': 0.0, 'error': str(e)}
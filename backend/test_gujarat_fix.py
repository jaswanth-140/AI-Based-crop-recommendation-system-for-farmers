"""
Test to verify Gujarat recommendations are correct
Based on: State Suitability + Soil + Season + Market Prices
"""
import requests
import json
from datetime import datetime

def test_gujarat_recommendations():
    """Test Bharuch, Gujarat recommendations"""
    
    # Bharuch, Gujarat coordinates
    lat, lon = 21.7051, 72.9959
    
    print("=" * 80)
    print("TESTING GUJARAT (Bharuch) CROP RECOMMENDATIONS")
    print("=" * 80)
    
    # Current month to determine season
    current_month = datetime.now().month
    if 6 <= current_month <= 9:
        season = "Kharif"
    elif current_month >= 10 or current_month <= 3:
        season = "Rabi"
    else:
        season = "Zaid"
    
    print(f"\nCurrent Season: {season}")
    print(f"Location: Bharuch, Gujarat")
    print(f"Expected Soil Type: Black Soil")
    
    print("\n" + "-" * 80)
    print("GUJARAT STATE-SPECIFIC SUITABILITY (from code):")
    print("-" * 80)
    gujarat_crops = {
        "Cotton": "High",
        "Groundnut": "High",
        "Bajra": "High",
        "Wheat": "Medium",
        "Rice": "Medium",
        "Maize": "Medium",
        "Jowar": "Medium",
        "Sugarcane": "Low",
        "Soybean": "Low",
        "Turmeric": "Low"
    }
    
    for crop, suitability in gujarat_crops.items():
        print(f"  {crop}: {suitability}")
    
    print("\n" + "-" * 80)
    print("BLACK SOIL SUITABLE CROPS:")
    print("-" * 80)
    black_soil_crops = ["Cotton", "Sugarcane", "Jowar", "Wheat", "Maize", "Soybean"]
    print(f"  {', '.join(black_soil_crops)}")
    
    print("\n" + "-" * 80)
    print(f"{season.upper()} SEASON CROPS:")
    print("-" * 80)
    season_crops = {
        "Kharif": ["Rice", "Cotton", "Maize", "Soybean", "Groundnut", "Bajra", "Jowar", "Turmeric", "Sugarcane"],
        "Rabi": ["Wheat", "Jowar", "Bajra", "Groundnut", "Maize", "Sugarcane"],
        "Zaid": ["Maize", "Groundnut", "Sugarcane", "Turmeric"]
    }
    print(f"  {', '.join(season_crops[season])}")
    
    print("\n" + "-" * 80)
    print("EXPECTED TOP RECOMMENDATIONS (High suitability + matching criteria):")
    print("-" * 80)
    
    # Find crops that are High suitability AND in current season
    expected_high = []
    for crop, suitability in gujarat_crops.items():
        if suitability == "High" and crop in season_crops[season]:
            soil_match = "✓" if crop in black_soil_crops else "✗"
            expected_high.append(f"{crop} (Soil: {soil_match})")
    
    print(f"  High Suitability: {', '.join(expected_high)}")
    
    # Find Medium suitability crops
    expected_medium = []
    for crop, suitability in gujarat_crops.items():
        if suitability == "Medium" and crop in season_crops[season]:
            soil_match = "✓" if crop in black_soil_crops else "✗"
            expected_medium.append(f"{crop} (Soil: {soil_match})")
    
    print(f"  Medium Suitability: {', '.join(expected_medium)}")
    
    print("\n" + "=" * 80)
    print("ACTUAL API RESPONSE:")
    print("=" * 80)
    
    try:
        response = requests.post(
            "http://localhost:5001/predict",
            json={"latitude": lat, "longitude": lon},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                soil_data = data.get('soil_data', {})
                predictions = data.get('predictions', {})
                
                print(f"\n✓ Soil Type: {soil_data.get('soil_type')}")
                print(f"✓ Season: {predictions.get('season')}")
                
                top_crops = predictions.get('top_recommendations', [])[:5]
                
                print(f"\nTop 5 Recommendations:")
                print("-" * 80)
                for i, crop_data in enumerate(top_crops, 1):
                    crop_name = crop_data['crop']
                    suitability = crop_data.get('suitability', 'Unknown')
                    soil_match = "✓" if crop_data.get('soil_match') else "✗"
                    confidence = crop_data.get('confidence', 0)
                    profit = crop_data.get('net_profit', 0)
                    score = crop_data.get('suitability_score', 0)
                    
                    print(f"{i}. {crop_name}")
                    print(f"   State Suitability: {suitability} | Soil Match: {soil_match} | Score: {score}")
                    print(f"   Confidence: {confidence}% | Profit: ₹{profit:,.0f}")
                
                print("\n" + "=" * 80)
                print("VERIFICATION:")
                print("=" * 80)
                
                # Check if top recommendation has High suitability
                if top_crops:
                    top_crop = top_crops[0]
                    if top_crop['suitability'] == 'High':
                        print(f"✓ PASS: Top crop '{top_crop['crop']}' has High suitability")
                    else:
                        print(f"✗ FAIL: Top crop '{top_crop['crop']}' has {top_crop['suitability']} suitability")
                        print(f"   Expected: High suitability crop from Gujarat")
                
                # Check if any Low suitability crops are in top 5
                low_crops = [c['crop'] for c in top_crops if c['suitability'] == 'Low']
                if low_crops:
                    print(f"✗ FAIL: Low suitability crops in top 5: {', '.join(low_crops)}")
                else:
                    print(f"✓ PASS: No Low suitability crops in top 5")
                
            else:
                print(f"✗ Error: {data.get('error')}")
        else:
            print(f"✗ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"✗ Exception: {str(e)}")

if __name__ == "__main__":
    test_gujarat_recommendations()

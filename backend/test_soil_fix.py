"""
Test script to verify soil-based crop recommendations are working
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_different_soil_types():
    """Test that different locations with different soil types get different recommendations"""
    
    # Test locations with different soil types
    test_locations = [
        # Black Soil - Maharashtra
        {"name": "Pune, Maharashtra (Black Soil)", "lat": 18.5204, "lon": 73.8567},
        # Red Soil - Karnataka
        {"name": "Bangalore, Karnataka (Red Soil)", "lat": 12.9716, "lon": 77.5946},
        # Alluvial Soil - Punjab
        {"name": "Ludhiana, Punjab (Alluvial Soil)", "lat": 30.9010, "lon": 75.8573},
        # Arid Soil - Rajasthan
        {"name": "Jodhpur, Rajasthan (Arid Soil)", "lat": 26.2389, "lon": 73.0243},
    ]
    
    print("=" * 80)
    print("TESTING SOIL-BASED CROP RECOMMENDATIONS")
    print("=" * 80)
    
    results = {}
    
    for location in test_locations:
        print(f"\n📍 Testing: {location['name']}")
        print(f"   Coordinates: ({location['lat']}, {location['lon']})")
        
        try:
            response = requests.post(
                f"{BASE_URL}/predict",
                json={"latitude": location['lat'], "longitude": location['lon']},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    soil_type = data['soil_data'].get('soil_type', 'Unknown')
                    predictions = data['predictions']
                    top_crops = predictions.get('top_recommendations', [])[:3]
                    
                    print(f"   Soil Type: {soil_type}")
                    print(f"   Top 3 Crops:")
                    for i, crop in enumerate(top_crops, 1):
                        soil_match = "✅" if crop.get('soil_match') else "❌"
                        print(f"      {i}. {crop['crop']} - {soil_match} Soil Match")
                        print(f"         Confidence: {crop.get('confidence')}%, Profit: ₹{crop.get('net_profit', 0):,.0f}")
                    
                    results[location['name']] = {
                        'soil_type': soil_type,
                        'top_crops': [c['crop'] for c in top_crops]
                    }
                else:
                    print(f"   ❌ Error: {data.get('error')}")
            else:
                print(f"   ❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Exception: {str(e)}")
    
    print("\n" + "=" * 80)
    print("SUMMARY - Top Crops by Location")
    print("=" * 80)
    for loc, data in results.items():
        print(f"\n{loc}")
        print(f"  Soil: {data['soil_type']}")
        print(f"  Crops: {', '.join(data['top_crops'])}")
    
    print("\n" + "=" * 80)
    print("VERIFICATION")
    print("=" * 80)
    
    # Check if different locations have different top crops
    all_top_crops = [tuple(data['top_crops']) for data in results.values()]
    unique_combinations = len(set(all_top_crops))
    
    if unique_combinations == 1:
        print("❌ FAILED: All locations showing same crops!")
        print("   The bug is NOT fixed.")
    elif unique_combinations > 1:
        print(f"✅ PASSED: Found {unique_combinations} different crop combinations")
        print("   The soil-based filtering is working!")
    
    return results

if __name__ == "__main__":
    test_different_soil_types()

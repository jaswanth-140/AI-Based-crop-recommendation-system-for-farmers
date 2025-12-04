"""
Direct API test to verify backend is serving correct data
"""
import requests
import json

# Bharuch, Gujarat
lat, lon = 21.7051, 72.9959

print("Testing API directly...")
print(f"Coordinates: {lat}, {lon}")

try:
    response = requests.post(
        "http://localhost:5001/predict",
        json={"latitude": lat, "longitude": lon},
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        
        print("\n✓ Response received")
        print(f"✓ Success: {data.get('success')}")
        print(f"✓ Soil Type: {data.get('soil_data', {}).get('soil_type')}")
        print(f"✓ Season: {data.get('predictions', {}).get('season')}")
        
        print("\nTop 3 Crops:")
        top_crops = data.get('predictions', {}).get('top_recommendations', [])[:3]
        for i, crop in enumerate(top_crops, 1):
            print(f"{i}. {crop['crop']} - {crop.get('suitability')} suitability - ₹{crop.get('net_profit', 0):,.0f}")
            
        # Print full JSON for debugging
        print("\n" + "="*80)
        print("FULL RESPONSE (for debugging):")
        print("="*80)
        print(json.dumps(data, indent=2))
        
    else:
        print(f"✗ HTTP Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"✗ Error: {str(e)}")
    import traceback
    traceback.print_exc()

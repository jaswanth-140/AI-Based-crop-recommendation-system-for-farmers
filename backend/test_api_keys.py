"""
Quick script to verify API keys are loaded correctly
"""
import os
from dotenv import load_dotenv
import requests

# Load .env file
load_dotenv()

print("=" * 60)
print("API KEY VERIFICATION")
print("=" * 60)

# Check if keys are loaded
openweather_key = os.getenv('OPENWEATHER_API_KEY')
mandi_key = os.getenv('MANDI_API_KEY')
village_geocode = os.getenv('VILLAGE_GEOCODE_KEY')
village_reverse = os.getenv('VILLAGE_REVERSE_KEY')

print("\n✓ Environment Variables Loaded:")
print(f"  OpenWeather API Key: {openweather_key[:10]}... (length: {len(openweather_key) if openweather_key else 0})")
print(f"  Mandi API Key: {mandi_key[:10]}... (length: {len(mandi_key) if mandi_key else 0})")
print(f"  Village Geocode Key: {village_geocode[:10]}... (length: {len(village_geocode) if village_geocode else 0})")
print(f"  Village Reverse Key: {village_reverse[:10]}... (length: {len(village_reverse) if village_reverse else 0})")

# Test OpenWeather API
print("\n" + "=" * 60)
print("TESTING OPENWEATHER API")
print("=" * 60)

test_lat = 17.385
test_lon = 78.486
url = f"https://api.openweathermap.org/data/2.5/weather?lat={test_lat}&lon={test_lon}&appid={openweather_key}&units=metric"

try:
    print(f"\nTesting coordinates: {test_lat}, {test_lon} (Hyderabad area)")
    response = requests.get(url, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS! OpenWeather API Key is VALID")
        print(f"   Location: {data.get('name', 'Unknown')}")
        print(f"   Temperature: {data['main']['temp']}°C")
        print(f"   Humidity: {data['main']['humidity']}%")
        print(f"   Weather: {data['weather'][0]['description']}")
    else:
        print(f"❌ FAILED! Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        if response.status_code == 401:
            print("\n⚠️  API Key is INVALID or NOT ACTIVATED yet")
            print("   - Wait 10-15 minutes after creating the key")
            print("   - Verify key at: https://home.openweathermap.org/api_keys")
        elif response.status_code == 429:
            print("\n⚠️  Rate limit exceeded")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE")
print("=" * 60)

# Summary
if response.status_code == 200:
    print("\n✅ All systems ready! You can now:")
    print("   1. Start backend: python app.py")
    print("   2. Start frontend: npm start")
    print("   3. Test different locations in the UI")
else:
    print("\n❌ Fix the issues above before proceeding")
    print("   - Check if OpenWeather API key is activated")
    print("   - Wait 10-15 minutes after creating new key")
    print("   - Verify .env file has correct key")

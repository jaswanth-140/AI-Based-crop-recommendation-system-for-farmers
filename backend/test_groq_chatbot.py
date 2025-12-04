"""
Quick test script for Groq chatbot integration (FREE API)
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 80)
print("TESTING GROQ CHATBOT INTEGRATION (FREE API)")
print("=" * 80)

# Check if API key is configured
groq_key = os.getenv('GROQ_API_KEY')

if not groq_key or groq_key == 'your-groq-api-key-here':
    print("\n❌ GROQ_API_KEY not configured!")
    print("\n📝 TO FIX:")
    print("1. Get your FREE API key from: https://console.groq.com")
    print("   - No credit card required!")
    print("   - Takes only 2 minutes")
    print("2. Open backend/.env file")
    print("3. Update: GROQ_API_KEY=gsk_your_actual_key")
    print("4. Run this test again")
    print("\n💡 See GROQ_SETUP_GUIDE.md for detailed instructions")
    exit(1)

print(f"\n✅ API Key found: {groq_key[:20]}..." + "*" * 20)

# Try to import and initialize chatbot
print("\n🔧 Testing chatbot initialization...")
try:
    from chatbot_service import chatbot
    
    if not chatbot.client:
        print("❌ Groq client failed to initialize")
        print("   Check if your API key is valid")
        exit(1)
    
    print(f"✅ Chatbot initialized successfully!")
    print(f"   Model: {chatbot.model}")
    print(f"   Provider: Groq (FREE)")
    
except Exception as e:
    print(f"❌ Failed to initialize chatbot: {e}")
    exit(1)

# Test text query
print("\n🧪 Testing text query...")
test_context = {
    'state': 'Gujarat',
    'district': 'Bharuch',
    'soil_type': 'Black Soil',
    'season': 'Rabi',
    'top_crops': ['Groundnut', 'Bajra', 'Jowar'],
    'temperature': 25,
    'humidity': 70
}

test_question = "What crops should I plant in this season?"

try:
    print(f"\n📝 Question: {test_question}")
    print("⏳ Generating response...")
    
    response = chatbot.generate_response(test_question, test_context)
    
    print(f"\n✅ Response generated successfully!")
    print(f"\n🤖 Answer: {response}")
    
    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED!")
    print("=" * 80)
    print("\n💡 Your FREE Groq chatbot is working correctly!")
    print("   • No payment required")
    print("   • 14,400 requests per day")
    print("   • Ultra-fast responses")
    print("\n🚀 You can now use the chatbot in your web app!")
    
except Exception as e:
    print(f"\n❌ Failed to generate response: {e}")
    print("\n📝 TROUBLESHOOTING:")
    print("1. Check if API key is valid (starts with gsk_)")
    print("2. Verify internet connection")
    print("3. Check rate limits: https://console.groq.com/usage")
    print("\n💡 Generate new key at: https://console.groq.com/keys")
    exit(1)

print("\n" + "=" * 80)
print("📊 GROQ FREE TIER LIMITS:")
print("=" * 80)
print("  • Requests per day: 14,400")
print("  • Requests per minute: 30")
print("  • Cost: $0 - COMPLETELY FREE!")
print("\n✨ Perfect for testing AND production!")

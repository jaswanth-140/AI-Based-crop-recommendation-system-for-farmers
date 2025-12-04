"""
Quick test script for OpenAI chatbot integration
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 80)
print("TESTING OPENAI CHATBOT INTEGRATION")
print("=" * 80)

# Check if API key is configured
openai_key = os.getenv('OPENAI_API_KEY')

if not openai_key or openai_key == 'your-openai-api-key-here':
    print("\n❌ OPENAI_API_KEY not configured!")
    print("\n📝 TO FIX:")
    print("1. Get your API key from: https://platform.openai.com/api-keys")
    print("2. Open backend/.env file")
    print("3. Replace 'your-openai-api-key-here' with your actual key")
    print("4. Run this test again")
    print("\n💡 See OPENAI_SETUP_GUIDE.md for detailed instructions")
    exit(1)

print(f"\n✅ API Key found: {openai_key[:20]}..." + "*" * 20)

# Try to import and initialize chatbot
print("\n🔧 Testing chatbot initialization...")
try:
    from chatbot_service import chatbot
    
    if not chatbot.client:
        print("❌ OpenAI client failed to initialize")
        print("   Check if your API key is valid")
        exit(1)
    
    print(f"✅ Chatbot initialized successfully!")
    print(f"   Model: {chatbot.model}")
    
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
    response = chatbot.generate_response(test_question, test_context)
    print(f"✅ Response generated successfully!")
    print(f"\n📝 Question: {test_question}")
    print(f"🤖 Answer: {response}")
    print("\n" + "=" * 80)
    print("✅ ALL TESTS PASSED!")
    print("=" * 80)
    print("\n💡 Your chatbot is working correctly!")
    print("   You can now use it in the web app")
    
except Exception as e:
    print(f"❌ Failed to generate response: {e}")
    print("\n📝 TROUBLESHOOTING:")
    print("1. Check if you have credits in your OpenAI account")
    print("2. Verify API key is valid")
    print("3. Check your internet connection")
    exit(1)

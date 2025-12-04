"""
Quick test script to verify chatbot setup
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("CHATBOT SETUP VERIFICATION")
print("=" * 60)

# Check Gemini API Key
gemini_key = os.getenv('GEMINI_API_KEY')
if gemini_key and gemini_key != 'your_gemini_api_key_here':
    print(f"✅ Gemini API Key: {gemini_key[:20]}... (configured)")
else:
    print("❌ Gemini API Key: NOT configured")

# Check Google Credentials
credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'google-credentials.json')
if os.path.exists(credentials_path):
    print(f"✅ Google Credentials: {credentials_path} (file exists)")
else:
    print(f"⚠️  Google Credentials: {credentials_path} (file NOT found)")
    print("   Note: Voice features will not work, but text chat will work!")

print("\n" + "=" * 60)
print("TESTING CHATBOT SERVICE")
print("=" * 60)

try:
    from chatbot_service import chatbot
    print("✅ Chatbot service imported successfully")
    
    # Check if Gemini is working
    if chatbot.model:
        print("✅ Gemini AI: Initialized")
        
        # Test a simple query
        print("\n📝 Testing AI response...")
        test_context = {
            'state': 'Maharashtra',
            'district': 'Pune',
            'soil_type': 'Black Soil',
            'season': 'Kharif',
            'top_crops': ['Cotton', 'Jowar']
        }
        
        response = chatbot.generate_response(
            "Which crop is best for black soil in Kharif season?",
            test_context
        )
        print(f"✅ AI Response: {response[:150]}...")
    else:
        print("❌ Gemini AI: Not initialized")
    
    # Check Google Cloud services
    if chatbot.speech_client:
        print("✅ Speech-to-Text: Initialized")
    else:
        print("⚠️  Speech-to-Text: Not initialized (voice input won't work)")
    
    if chatbot.tts_client:
        print("✅ Text-to-Speech: Initialized")
    else:
        print("⚠️  Text-to-Speech: Not initialized (voice output won't work)")
    
    # Check supported languages
    print(f"\n✅ Supported Languages: {len(chatbot.language_codes)}")
    print(f"   Languages: {', '.join(list(chatbot.language_codes.keys())[:5])}...")
    
except Exception as e:
    print(f"❌ Error loading chatbot: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

# Check what works
works = []
warnings = []

if gemini_key and gemini_key != 'your_gemini_api_key_here':
    works.append("Text chatbot (Gemini AI)")
else:
    warnings.append("Gemini API key not configured")

if os.path.exists(credentials_path):
    works.append("Voice input (Speech-to-Text)")
    works.append("Voice output (Text-to-Speech)")
else:
    warnings.append("Google Cloud credentials not found - voice features disabled")

if works:
    print("\n✅ WORKING:")
    for item in works:
        print(f"   • {item}")

if warnings:
    print("\n⚠️  WARNINGS:")
    for item in warnings:
        print(f"   • {item}")

print("\n" + "=" * 60)
print("NEXT STEPS")
print("=" * 60)

if not warnings:
    print("✅ Everything is configured! You can now:")
    print("   1. Restart backend: python app.py")
    print("   2. Test endpoint: curl http://localhost:5001/chatbot/status")
    print("   3. Try text chat with /chatbot/text")
    print("   4. Try voice chat with /chatbot/voice")
else:
    if gemini_key and gemini_key != 'your_gemini_api_key_here':
        print("✅ Text chatbot will work!")
        print("   1. Restart backend: python app.py")
        print("   2. Test: curl http://localhost:5001/chatbot/status")
        print("\n⚠️  For voice features, add google-credentials.json")
    else:
        print("❌ Please configure GEMINI_API_KEY in .env")

print("=" * 60)

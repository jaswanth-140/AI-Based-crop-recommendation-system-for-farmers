"""
Voice Assistant Test Script
Tests the chatbot backend to ensure voice features are working
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_backend_status():
    """Test if backend is running"""
    print("=" * 60)
    print("TEST 1: Backend Status")
    print("=" * 60)
    try:
        response = requests.get(f"{BASE_URL}/chatbot/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is RUNNING")
            print(f"   - Groq API: {'✅ Configured' if data.get('groq_configured') else '❌ Not configured'}")
            print(f"   - Google Cloud: {'✅ Configured' if data.get('google_cloud_configured') else '❌ Not configured'}")
            print(f"   - Model: {data.get('model', 'Unknown')}")
            return True
        else:
            print(f"❌ Backend returned error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is NOT RUNNING")
        print("   Please start it with: python backend/app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_text_chat():
    """Test text-based chatbot"""
    print("\n" + "=" * 60)
    print("TEST 2: Text Chat")
    print("=" * 60)
    try:
        payload = {
            "message": "Hello, what crops can I grow?",
            "language": "en",
            "context": {
                "state": "Telangana",
                "soil_type": "Red Loam"
            }
        }
        
        print(f"Sending message: {payload['message']}")
        response = requests.post(
            f"{BASE_URL}/chatbot/text",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Text chat WORKING")
                print(f"   Response: {data.get('response_text', '')[:100]}...")
                print(f"   Audio included: {'✅ Yes' if data.get('audio_response') else '❌ No'}")
                return True
            else:
                print(f"❌ Chat failed: {data.get('error')}")
                return False
        else:
            print(f"❌ Request failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_language_support():
    """Test multilingual support"""
    print("\n" + "=" * 60)
    print("TEST 3: Multilingual Support")
    print("=" * 60)
    
    languages = {
        'en': 'Hello',
        'hi': 'नमस्ते',
        'te': 'నమస్కారం'
    }
    
    for lang_code, greeting in languages.items():
        try:
            payload = {
                "message": greeting,
                "language": lang_code
            }
            
            response = requests.post(
                f"{BASE_URL}/chatbot/text",
                json=payload,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"✅ {lang_code.upper()}: Working")
                else:
                    print(f"⚠️  {lang_code.upper()}: {data.get('error')}")
            else:
                print(f"❌ {lang_code.upper()}: HTTP {response.status_code}")
        except Exception as e:
            print(f"❌ {lang_code.upper()}: {str(e)[:50]}")

def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "VOICE ASSISTANT TEST SUITE" + " " * 21 + "║")
    print("╚" + "=" * 58 + "╝")
    print("\n")
    
    # Test 1: Backend Status
    if not test_backend_status():
        print("\n❌ Backend not running. Start it first:")
        print("   cd backend")
        print("   python app.py")
        return
    
    # Test 2: Text Chat
    test_text_chat()
    
    # Test 3: Language Support
    test_language_support()
    
    # Final Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print("If all tests passed, your voice assistant backend is ready!")
    print("\nNext steps:")
    print("1. Open frontend: http://localhost:3000")
    print("2. Navigate to Chat tab")
    print("3. Click microphone button (🎙️)")
    print("4. Allow microphone permission")
    print("5. Speak your question")
    print("\n")

if __name__ == "__main__":
    main()

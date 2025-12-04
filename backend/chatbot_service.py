"""
Multilingual Voice Chatbot Service
Supports: Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, English
Uses: Google Cloud Speech-to-Text, Text-to-Speech, and Groq API (FREE)
"""

from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech
from groq import Groq
from langdetect import detect
import os
import logging

logger = logging.getLogger(__name__)

class MultilingualChatbot:
    """Handles voice and text chatbot interactions in multiple Indian languages"""
    
    def __init__(self):
        # Set Google Cloud credentials path
        credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'google-credentials.json')
        if os.path.exists(credentials_path):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
            logger.info(f"Using Google credentials: {credentials_path}")
        else:
            logger.warning(f"Google credentials not found at: {credentials_path}")
        
        try:
            # Initialize Google Cloud clients
            self.speech_client = speech.SpeechClient()
            self.tts_client = texttospeech.TextToSpeechClient()
            logger.info("Google Cloud clients initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Google Cloud clients: {e}")
            self.speech_client = None
            self.tts_client = None
        
        # Initialize Groq (FREE API)
        groq_key = os.getenv('GROQ_API_KEY')
        if groq_key and groq_key != 'your-groq-api-key-here':
            try:
                self.client = Groq(api_key=groq_key)
                self.model = 'llama-3.3-70b-versatile'  # Currently active model (Oct 2024+)
                logger.info(f"Groq initialized successfully with model: {self.model}")
            except Exception as e:
                logger.error(f"Failed to initialize Groq: {e}")
                self.client = None
                self.model = None
        else:
            logger.warning("GROQ_API_KEY not found or not configured in environment")
            self.client = None
            self.model = None
        
        # Language code mapping for Google Cloud
        self.language_codes = {
            'hi': 'hi-IN',  # Hindi
            'te': 'te-IN',  # Telugu
            'ta': 'ta-IN',  # Tamil
            'kn': 'kn-IN',  # Kannada
            'mr': 'mr-IN',  # Marathi
            'bn': 'bn-IN',  # Bengali
            'gu': 'gu-IN',  # Gujarati
            'ml': 'ml-IN',  # Malayalam
            'pa': 'pa-IN',  # Punjabi
            'en': 'en-IN',  # English (India)
        }
        
        # Voice selection for each language (natural-sounding voices)
        self.voice_mapping = {
            'hi-IN': 'hi-IN-Wavenet-D',      # Hindi male
            'te-IN': 'te-IN-Standard-A',      # Telugu female
            'ta-IN': 'ta-IN-Wavenet-A',       # Tamil female
            'kn-IN': 'kn-IN-Wavenet-A',       # Kannada female
            'mr-IN': 'mr-IN-Wavenet-A',       # Marathi female
            'bn-IN': 'bn-IN-Wavenet-A',       # Bengali female
            'gu-IN': 'gu-IN-Wavenet-A',       # Gujarati female
            'ml-IN': 'ml-IN-Wavenet-A',       # Malayalam female
            'pa-IN': 'pa-IN-Wavenet-A',       # Punjabi female
            'en-IN': 'en-IN-Wavenet-D',       # English male
        }
    
    def speech_to_text(self, audio_content, language_hint='en-IN'):
        """
        Convert speech audio to text using Google Cloud Speech-to-Text
        Supports auto language detection for Indian languages
        """
        if not self.speech_client:
            return None, "Speech client not initialized"
        
        try:
            audio = speech.RecognitionAudio(content=audio_content)
            
            # Configure recognition with multiple language support
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=48000,
                language_code=language_hint,
                alternative_language_codes=[
                    'hi-IN', 'te-IN', 'ta-IN', 'kn-IN', 'mr-IN',
                    'bn-IN', 'gu-IN', 'ml-IN', 'pa-IN', 'en-IN'
                ],
                enable_automatic_punctuation=True,
                model='latest_long',
            )
            
            # Recognize speech
            response = self.speech_client.recognize(config=config, audio=audio)
            
            if response.results:
                transcript = response.results[0].alternatives[0].transcript
                detected_language = response.results[0].language_code
                logger.info(f"Transcribed: {transcript} (Language: {detected_language})")
                return transcript, detected_language
            else:
                return None, "No speech detected"
                
        except Exception as e:
            logger.error(f"Speech-to-text error: {e}")
            return None, str(e)
    
    def detect_language(self, text):
        """Detect language of text using langdetect"""
        try:
            lang = detect(text)
            language_code = self.language_codes.get(lang, 'en-IN')
            logger.info(f"Detected language: {lang} → {language_code}")
            return language_code
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return 'en-IN'
    
    def generate_response(self, user_message, context=None):
        """
        Generate AI response using Groq with farming context
        Context includes: location, soil, season, recommended crops
        """
        if not self.client or not self.model:
            return "AI service not available. Please configure GROQ_API_KEY in the .env file."
        
        try:
            # Build context-aware prompt
            context = context or {}
            
            system_prompt = """You are an expert agricultural advisor helping Indian farmers with crop recommendations and farming questions.

Key Instructions:
1. Answer in the SAME language as the user's question (support Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Malayalam, Punjabi, English)
2. Be concise and practical (2-3 sentences max)
3. Use the provided context to give location-specific advice
4. If asked about crops, reference the recommended crops from context
5. Focus on actionable farming advice
6. Be culturally sensitive to Indian farming practices"""
            
            user_prompt = f"""Context Information:
- Location: {context.get('state', 'Unknown')}, {context.get('district', 'Unknown')}
- Soil Type: {context.get('soil_type', 'Not specified')}
- Current Season: {context.get('season', 'Not specified')}
- Recommended Crops: {', '.join(context.get('top_crops', ['Not available']))}
- Temperature: {context.get('temperature', 'Unknown')}°C
- Humidity: {context.get('humidity', 'Unknown')}%

User Question: {user_message}"""

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            answer = response.choices[0].message.content.strip()
            logger.info(f"Generated response: {answer[:100]}...")
            return answer
            
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return f"I'm having trouble generating a response. Error: {str(e)}"
    
    def text_to_speech(self, text, language_code='en-IN'):
        """Convert text to speech using Google Cloud Text-to-Speech"""
        if not self.tts_client:
            return None, "TTS client not initialized"
        
        try:
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Select voice for the language
            voice_name = self.voice_mapping.get(language_code, 'en-IN-Wavenet-D')
            voice = texttospeech.VoiceSelectionParams(
                language_code=language_code,
                name=voice_name
            )
            
            # Configure audio output
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=0.9,  # Slightly slower for clarity
                pitch=0.0,
                volume_gain_db=0.0
            )
            
            # Generate speech
            response = self.tts_client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            logger.info(f"Generated TTS audio for language: {language_code}")
            return response.audio_content, None
            
        except Exception as e:
            logger.error(f"Text-to-speech error: {e}")
            return None, str(e)
    
    def process_voice_query(self, audio_content, context=None):
        """
        Complete voice processing pipeline:
        Voice Input → Text → AI Response → Voice Output
        """
        logger.info("Processing voice query...")
        
        # Step 1: Convert speech to text
        text, language_code = self.speech_to_text(audio_content)
        if not text:
            return {"success": False, "error": f"Could not transcribe audio: {language_code}"}
        
        # Step 2: Generate AI response with context
        response_text = self.generate_response(text, context)
        
        # Step 3: Convert response to speech
        audio_response, error = self.text_to_speech(response_text, language_code)
        if error:
            return {
                "success": True,
                "user_text": text,
                "language": language_code,
                "response_text": response_text,
                "audio_response": None,
                "error": f"TTS error: {error}"
            }
        
        return {
            "success": True,
            "user_text": text,
            "language": language_code,
            "response_text": response_text,
            "audio_response": audio_response
        }
    
    def process_text_query(self, text, context=None):
        """Process text-only query (no voice)"""
        logger.info(f"Processing text query: {text[:50]}...")
        
        # Detect language
        language_code = self.detect_language(text)
        
        # Generate response
        response_text = self.generate_response(text, context)
        
        return {
            "success": True,
            "language": language_code,
            "response_text": response_text
        }

# Global chatbot instance
chatbot = MultilingualChatbot()

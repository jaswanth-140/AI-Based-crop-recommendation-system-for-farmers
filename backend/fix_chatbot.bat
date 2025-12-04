@echo off
echo ========================================
echo CHATBOT FIX SCRIPT
echo ========================================
echo.

echo Step 1: Installing required packages...
echo.
pip install google-cloud-speech google-cloud-texttospeech google-generativeai langdetect protobuf
echo.

echo Step 2: Testing chatbot setup...
echo.
python test_chatbot.py
echo.

echo ========================================
echo.
echo If you see green checkmarks above:
echo   - Run: python app.py
echo   - Then refresh your browser
echo.
echo If you see red X marks:
echo   - Check .env file has GEMINI_API_KEY
echo   - Make sure google-credentials.json exists
echo.
pause

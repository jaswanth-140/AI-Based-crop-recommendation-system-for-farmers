@echo off
echo Installing Chatbot Dependencies...
echo.

echo [1/3] Installing Google Cloud Speech-to-Text...
pip install google-cloud-speech

echo.
echo [2/3] Installing Google Cloud Text-to-Speech...
pip install google-cloud-texttospeech

echo.
echo [3/3] Installing additional dependencies...
pip install protobuf

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: python test_chatbot.py
echo 2. If successful, run: python app.py
echo.
pause

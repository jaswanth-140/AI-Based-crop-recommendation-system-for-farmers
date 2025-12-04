"""Quick OpenAI API test"""
from openai import OpenAI
import os

# Set API key directly
api_key = "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"

print("Testing OpenAI API...")
print(f"API Key: {api_key[:20]}...{api_key[-10:]}")

try:
    client = OpenAI(api_key=api_key)
    
    print("\n✅ Client initialized")
    print("Sending test request...")
    
    response = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=[
            {"role": "system", "content": "You are a helpful agricultural advisor."},
            {"role": "user", "content": "What crops are good for black soil in Gujarat during Rabi season?"}
        ],
        max_tokens=150
    )
    
    answer = response.choices[0].message.content
    print(f"\n✅ SUCCESS! API is working!")
    print(f"\nResponse: {answer}")
    print("\n" + "="*80)
    print("🎉 Your OpenAI API key is working correctly!")
    print("The chatbot is ready to use in your application.")
    print("="*80)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nPossible issues:")
    print("1. API key is invalid")
    print("2. No credits in your OpenAI account")
    print("3. Internet connection issue")

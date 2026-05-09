import requests
import json

url = 'https://api.ocr.space/parse/image'
payload = {
    'apikey': 'helloworld',
    'language': 'eng',
}
try:
    with open(r"c:\Users\Ahmed Anter\Desktop\2026\WhatsApp Image 2026-05-04 at 10.51.31 AM.jpeg", 'rb') as f:
        r = requests.post(url, files={'filename': f}, data=payload)
    
    result = r.json()
    if result.get('IsErroredOnProcessing'):
        print("Error processing image:", result.get('ErrorMessage'))
    else:
        text = result.get('ParsedResults', [{}])[0].get('ParsedText', '')
        print("--- EXTRACTED TEXT ---")
        print(text)
        print("----------------------")
except Exception as e:
    print(f"Failed to call OCR API: {e}")

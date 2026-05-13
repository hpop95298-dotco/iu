import sys
try:
    from PIL import Image
    import pytesseract
except ImportError:
    print("Missing PIL or pytesseract. Please install with: pip install pillow pytesseract")
    sys.exit(1)

import os

image_path = r"c:\Users\Ahmed Anter\Desktop\2026\WhatsApp Image 2026-05-04 at 10.51.31 AM.jpeg"

if not os.path.exists(image_path):
    print(f"File not found: {image_path}")
    sys.exit(1)

try:
    # Try common tesseract paths on Windows
    tesseract_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\Ahmed Anter\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
    ]
    
    for p in tesseract_paths:
        if os.path.exists(p):
            pytesseract.pytesseract.tesseract_cmd = p
            break
            
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    print("--- EXTRACTED TEXT ---")
    print(text)
    print("----------------------")
except Exception as e:
    print(f"Error extracting text: {e}")

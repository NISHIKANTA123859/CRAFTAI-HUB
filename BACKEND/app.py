import os
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

def analyze_image(image_data):
    if not api_key:
        return {
            "error": "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."
        }

    try:
        # Decode base64 image
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes))

        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = """
        Identify the traditional craft in this image. 
        Provide the following details in JSON format:
        {
          "name": "Name of the craft",
          "origin": "Region or country of origin",
          "description": "2-3 sentences about the craft and its cultural significance",
          "authenticity": "An estimated authenticity score from 0-100 based on visible features",
          "confidence": "Your confidence level in this identification from 0-100"
        }
        Only return the JSON object.
        """

        response = model.generate_content([prompt, img])
        
        # Extract JSON from response
        import json
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)

    except Exception as e:
        print(f"Error analyzing image: {e}")
        return {"error": str(e)}

@app.route('/api/analyze-craft', methods=['POST'])
def analyze_craft():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "No image data provided"}), 400

    result = analyze_image(data['image'])
    if "error" in result:
        return jsonify(result), 500
        
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "gemini_configured": bool(api_key)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)

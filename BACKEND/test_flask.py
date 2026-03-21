import requests
import base64
import os

def test_flask():
    image_path = 'test_image.png'
    if not os.path.exists(image_path):
        print("No test image found.")
        return

    with open(image_path, 'rb') as f:
        img_base64 = base64.b64encode(f.read()).decode('utf-8')

    try:
        response = requests.post('http://localhost:5001/api/analyze-craft', json={'image': img_base64})
        print("Flask Response:", response.json())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_flask()

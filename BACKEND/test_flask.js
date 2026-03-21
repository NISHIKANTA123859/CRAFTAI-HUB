const fetch = require('node-fetch');
const fs = require('fs');

async function testFlask() {
  try {
    const imagePath = './test_image.png'; // Using existing test image in BACKEND
    if (!fs.existsSync(imagePath)) {
        console.log("No test image found.");
        return;
    }
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await fetch('http://localhost:5001/api/analyze-craft', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageBase64 }),
    });

    const data = await response.json();
    console.log("Flask Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test Error:", error);
  }
}

testFlask();

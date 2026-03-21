require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });
    // There isn't a direct listModels in the client SDK usually, 
    // but we can try a simple generation with a few model names.
    const models = ["gemini-2.0-flash", "gemini-3.1-flash-image-preview", "gemini-pro"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        const response = await result.response;
        console.log(`Model ${modelName} works!`);
        process.exit(0);
      } catch (e) {
        console.log(`Model ${modelName} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();

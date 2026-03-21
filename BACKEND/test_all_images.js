const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = [
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
    "gemini-3-pro-image-preview",
    "nano-banana-pro-preview",
    "gemini-2.0-flash"
  ];

  for (const modelName of models) {
    console.log(`\nTesting ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Create a simple red square image.");
      const response = await result.response;
      console.log(`Success with ${modelName}!`);
      console.log("Response Parts:", JSON.stringify(response.candidates[0].content.parts, null, 2));
    } catch (err) {
      console.error(`Failed ${modelName}: ${err.message}`);
    }
  }
}

testModels();

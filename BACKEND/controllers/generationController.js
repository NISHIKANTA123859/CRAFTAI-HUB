/**
 * Generation Controller
 * Handles AI-powered craft design generation logic.
 */

/**
 * Generates a craft design image URL.
 * Currently uses high-quality Unsplash images as a professional fallback.
 * Can be extended to use OpenAI DALL-E or Midjourney APIs.
 */
exports.generateDesign = async (req, res) => {
  try {
    const { craftType, designStyle } = req.body;

    if (!craftType || !designStyle) {
      return res.status(400).json({ 
        success: false, 
        error: "Craft type and design style are required." 
      });
    }

    console.log(`Generating ${designStyle} ${craftType} design...`);

    const expertPrompt = `You are an expert AI image generator specializing in traditional Indian handicrafts.

TASK:
Generate a high-quality image based on the given craft type and design style.

INPUT:
- Craft Type: ${craftType}
- Design Style: ${designStyle}

-------------------------------------

INSTRUCTIONS:
1. Understand the traditional identity of the craft.
2. Apply the selected design style creatively.

-------------------------------------

CRAFT GUIDELINES:
- Madhubani: Dense patterns, Bright natural colors (red, yellow, green), Mythological and nature elements
- Warli: Stick human figures, Tribal scenes, White drawings on dark earthy background
- Kalamkari: Floral motifs, Storytelling scenes, Earthy tones and hand-drawn feel
- Pattachitra: Bold outlines, Religious or cultural themes, Intricate detailing

-------------------------------------

STYLE RULES:
- Modern: Clean and minimal layout, Balanced spacing
- Fusion: Blend traditional + contemporary design
- Traditional: Preserve original dense and detailed patterns

-------------------------------------

IMAGE REQUIREMENTS:
- Ultra high quality, 4K resolution, Professional artwork, Centered composition, Symmetrical or well-balanced layout, Clear textures and patterns, textile-friendly repeat design

-------------------------------------

STRICT RULES:
- No text in the image, No watermark, No distortion, Maintain cultural authenticity

-------------------------------------

FINAL OUTPUT:
Generate ONLY the image based on:
"Create a ${designStyle} style ${craftType} artwork with traditional patterns, cultural motifs, and detailed artistic elements, suitable for real-world design use."`;

    let imageUrls = [];

    // If OpenAI API key is present, use DALL-E 3 (Generating multiple images)
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: expertPrompt,
          n: 1, // DALL-E 3 only supports n=1 currently, so we'd need multiple calls for a true gallery
          size: "1024x1024",
        });
        imageUrls.push(response.data[0].url);
      } catch (err) {
        console.error("OpenAI Generation Error:", err.message);
      }
    } else if (process.env.GEMINI_API_KEY) {
      // Use Gemini 3.1 Flash for Native Image Generation - Parallel Calls for 'min 2' images
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
        
        // Make 2 parallel calls to satisfy "min 2 images"
        const generationPromises = [1, 2].map(async (i) => {
            try {
                const result = await model.generateContent({
                  contents: [{ role: "user", parts: [{ text: `${expertPrompt} (Variation ${i})` }] }],
                });
                const response = await result.response;
                if (response.candidates && response.candidates[0].content.parts) {
                    const parts = response.candidates[0].content.parts;
                    const imagePart = parts.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
                    if (imagePart) {
                        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                    }
                }
            } catch (innerErr) {
                console.error(`Gemini Call ${i} Error:`, innerErr.message);
            }
            return null;
        });

        const generatedResults = await Promise.all(generationPromises);
        imageUrls.push(...generatedResults.filter(url => url !== null));
        
      } catch (err) {
        console.error("Gemini Multi-Generation Error:", err.message);
      }
    }

    // If no images from primary AI, use Pollinations AI as a powerful keyless generator
    if (imageUrls.length < 2) {
      console.log("No images from primary AI, using Pollinations AI...");
      try {
        // Use a more concise prompt for Pollinations to avoid URL length issues
        const shortPrompt = `High quality ${designStyle} style ${craftType} handicrafts design, traditional motifs, professional artwork, 4k`;
        const encodedPrompt = encodeURIComponent(shortPrompt);
        
        for (let i = imageUrls.length; i < 2; i++) {
          const seed = Math.floor(Math.random() * 1000000);
          const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${seed}`;
          imageUrls.push(pollinationsUrl);
        }
      } catch (err) {
        console.error("Pollinations Generation Error:", err.message);
      }
    }

    // Still fill to 4 with Unsplash if we need more variety
    if (imageUrls.length < 4) {
        const baseFallbacks = {
            "Madhubani": ["photo-1582201942988-13e60e4556ee", "photo-1599148400624-8cd1861008da"],
            "Warli": ["photo-1605645513303-3171352f7f9d", "photo-1541250357597-400902888242"],
            "Kalamkari": ["premium_photo-1661914240751-2cc02d640987", "photo-1544967082-d9d25d867d66"],
            "Pattachitra": ["photo-1590736704728-f4730bb30770", "photo-1531995811006-35cb42e1a021"],
            "Pottery": ["photo-1610701596007-11502861dcfa", "photo-1541250357597-400902888242"],
            "Textile Weaving": ["photo-1544967082-d9d25d867d66", "premium_photo-1661914240751-2cc02d640987"]
        };

        const ids = baseFallbacks[craftType] || baseFallbacks["Pottery"];
        while (imageUrls.length < 4) {
            const nextId = ids[imageUrls.length % ids.length];
            // Use cleaner Unsplash URLs to avoid 404s
            imageUrls.push(`https://images.unsplash.com/${nextId}?auto=format&fit=crop&w=800&q=80`);
        }
    }

    // Proxy all URLs to bypass ORB/CORS
    const proxiedImageUrls = imageUrls.map(url => {
      // Don't proxy base64 data URLs
      if (url.startsWith('data:')) return url;
      return `http://localhost:5002/api/proxy-image?url=${encodeURIComponent(url)}`;
    });

    res.status(200).json({
      success: true,
      imageUrls: proxiedImageUrls
    });

  } catch (error) {
    console.error("Error in generateDesign:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error during generation." 
    });
  }
};

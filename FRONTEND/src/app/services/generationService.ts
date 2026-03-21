/**
 * Generation Service
 * Handles AI-powered craft design generation.
 */

const API_BASE_URL = "http://localhost:5002/api";

export interface GenerationResult {
  imageUrls: string[];
  success: boolean;
  error?: string;
}

/**
 * Generates a craft design based on type and style.
 * @param craftType - The type of craft (e.g., Pottery, Textile)
 * @param designStyle - The artistic style (e.g., Modern, Traditional)
 * @returns A Promise that resolves to the generation result.
 */
export async function generateCraftDesign(craftType: string, designStyle: string): Promise<GenerationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-design`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ craftType, designStyle }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate design");
    }

    const data = await response.json();
    return {
      imageUrls: data.imageUrls || [],
      success: true
    };
  } catch (error: any) {
    console.error("Generation API Error:", error);
    return {
      imageUrls: [],
      success: false,
      error: error.message || "Failed to connect to generation service."
    };
  }
}

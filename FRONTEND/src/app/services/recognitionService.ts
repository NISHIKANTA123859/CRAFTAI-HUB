/**
 * Recognition Service
 * Handles communication with the CraftVision AI API.
 */

const API_BASE_URL = "http://localhost:5002/api";

export interface RecognitionResult {
  craft: string;
  origin: string;
  description: string;
  authenticity: string;
  reason: string[];
  success: boolean;
  error?: string;
}

/**
 * Sends an image to the CraftVision AI recognition endpoint.
 * @param file - The image file to be analyzed.
 * @returns A Promise that resolves to the recognition result.
 */
export async function recognizeCraft(file: File): Promise<RecognitionResult> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/recognition`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Call Error:", error);
    throw new Error("Failed to connect to the recognition service. Please ensure the backend is running on port 5002.");
  }
}

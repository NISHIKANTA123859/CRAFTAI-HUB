/**
 * Auth Service
 * Handles communication with the CraftAuth AI API.
 */

const API_BASE_URL = "http://localhost:5002/api";

export interface AuthResult {
  authenticity_score: string;
  status: "GENUINE" | "FAKE";
  analysis: string[];
  success: boolean;
  error?: string;
}

/**
 * Sends an image to the CraftAuth AI authentication endpoint.
 * @param file - The image file to be analyzed.
 * @returns A Promise resolving to the authentication result.
 */
export async function authenticateCraft(file: File): Promise<AuthResult> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Auth API Call Error:", error);
    throw new Error("Failed to connect to the authentication service. Please ensure the backend is running on port 5002.");
  }
}

/**
 * History Service
 * Handles saving and retrieving analysis history.
 */

const API_BASE_URL = "http://localhost:5002/api";

export interface HistoryRecord {
  id: number;
  craft: string;
  origin: string;
  description: string;
  authenticity: string;
  image: string;
  reason?: string[];
  createdAt: string;
}

/**
 * Saves a recognition result to history.
 */
export async function saveToHistory(record: Omit<HistoryRecord, 'id' | 'createdAt'>): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error("Failed to save history");
    }
  } catch (error) {
    console.error("Error saving history:", error);
  }
}

/**
 * Fetches the analysis history.
 */
export async function getHistory(): Promise<HistoryRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

/**
 * Clears the history.
 */
export async function clearHistory(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to clear history");
    }
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

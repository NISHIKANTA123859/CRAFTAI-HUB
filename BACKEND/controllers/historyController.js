const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../data/history.json');

/**
 * Helper to read history from JSON file
 */
const readHistory = () => {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history file:", error);
    return [];
  }
};

/**
 * Helper to write history to JSON file
 */
const writeHistory = (history) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error("Error writing history file:", error);
  }
};

/**
 * Save a new history record
 */
exports.saveHistory = async (req, res) => {
  try {
    const { craft, origin, description, authenticity, image, reason } = req.body;

    if (!craft || !origin || !image) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const history = readHistory();
    
    const newRecord = {
      id: Date.now(),
      craft,
      origin,
      description,
      authenticity,
      image, // Storing as base64 for hackathon simplicity
      reason: reason || [],
      createdAt: new Date().toISOString()
    };

    // Add to beginning of array
    history.unshift(newRecord);

    // Limit to 10 records
    const limitedHistory = history.slice(0, 10);

    writeHistory(limitedHistory);

    res.status(201).json({ success: true, message: "History saved successfully" });
  } catch (error) {
    console.error("Error in saveHistory:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

/**
 * Get all history records
 */
exports.getHistory = async (req, res) => {
  try {
    const history = readHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error("Error in getHistory:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

/**
 * Delete all history
 */
exports.deleteHistory = async (req, res) => {
  try {
    writeHistory([]);
    res.status(200).json({ success: true, message: "History cleared" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

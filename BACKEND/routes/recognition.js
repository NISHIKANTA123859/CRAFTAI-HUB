const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const recognitionController = require('../controllers/recognitionController');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (jpg, jpeg, png, gif, webp) are allowed!"));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Route: POST /api/recognition
router.post('/recognition', upload.single('image'), recognitionController.recognizeCraft);

// Route: POST /api/analyze-product
router.post('/analyze-product', recognitionController.analyzeProductUrl);

// Helper GET route to show status
router.get('/recognition', (req, res) => {
  res.json({ 
    success: true, 
    message: "CraftVision Recognition endpoint is ready. Use POST to upload and analyze images." 
  });
});

module.exports = router;

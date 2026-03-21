const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const ok = filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error("Only image files are allowed!"));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Route: POST /api/authenticate
router.post('/authenticate', upload.single('image'), authController.authenticateCraft);

module.exports = router;

const express = require('express');
const router = express.Router();
const generationController = require('../controllers/generationController');

// Route: POST /api/generate-design
router.post('/generate-design', generationController.generateDesign);

module.exports = router;

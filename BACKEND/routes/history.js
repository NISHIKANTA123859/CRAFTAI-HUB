const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Routes for History
router.post('/history', historyController.saveHistory);
router.get('/history', historyController.getHistory);
router.delete('/history', historyController.deleteHistory);

module.exports = router;

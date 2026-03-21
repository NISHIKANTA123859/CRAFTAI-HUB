const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - Place a new order
router.post('/orders', orderController.placeOrder);

// GET /api/orders - Retrieve all orders (Admin only)
router.get('/orders', orderController.getOrders);

// Route: GET /api/orders/:id (Retrieve specific order)
router.get('/orders/:id', orderController.getOrderById);

module.exports = router;

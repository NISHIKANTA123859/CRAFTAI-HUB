const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

// Ensure data file exists
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

/**
 * Saves a new order to orders.json
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.placeOrder = (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid order data"
      });
    }

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    
    const newOrder = {
      id: `CRAFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      status: "Processing",
      ...orderData
    };

    orders.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    res.status(201).json({
      success: true,
      orderId: newOrder.id,
      message: "Order placed successfully"
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process order"
    });
  }
};

/**
 * Retrieves all orders for the admin panel
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getOrders = (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.status(200).json({
      success: true,
      orders: orders.reverse() // Newest first
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve orders"
    });
  }
};

/**
 * Retrieves a single order by ID for tracking
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG] Searching for Order ID: "${id}"`);
    
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    const order = orders.find(o => String(o.id).trim() === String(id).trim());

    if (!order) {
      console.log(`[DEBUG] Order "${id}" NOT found in ${orders.length} orders.`);
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    console.log(`[DEBUG] Order "${id}" found successfully.`);
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve order"
    });
  }
};

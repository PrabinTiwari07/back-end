const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Create a new order
router.post('/', authenticateToken, authorizeRole('user'), orderController.createOrder);

// Get all orders
router.get('/', authenticateToken, authorizeRole('admin'), orderController.getAllOrders);

// Get a single order by ID
router.get('/:id', authenticateToken, orderController.getOrderById);

// Update an order
router.put('/:id', authenticateToken, authorizeRole('admin'), orderController.updateOrder);

// Delete an order
router.delete('/:id', authenticateToken, authorizeRole('admin'), orderController.deleteOrder);

module.exports = router;

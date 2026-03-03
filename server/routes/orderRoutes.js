const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (needed for checkout visualization/calculation)
router.get('/config/payment', orderController.getPaymentConfig);
router.get('/summary-info', orderController.getSummaryInfo);
router.post('/delivery-charge', orderController.calculateDeliveryCharge);

// Protected routes (require login)
router.use(authMiddleware);

router.post('/stripe-intent', orderController.createStripeIntent);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;

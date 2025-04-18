const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Handle successful payment
router.post('/success', paymentController.handleSuccessfulPayment);

// Get payment history
router.get('/history/:bookingId', paymentController.getPaymentHistory);

// Refund payment
router.post('/refund/:paymentId', paymentController.refundPayment);

// Get payment status
router.get('/status/:paymentId', paymentController.getPaymentStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// Delete booking
router.delete('/:id', bookingController.deleteBooking);

// Get bookings by date range
router.get('/date-range', bookingController.getBookingsByDateRange);

module.exports = router;

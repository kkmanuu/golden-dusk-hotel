const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create email transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports like 587
    auth: {
        user: 'sowdasheikh01@gmail.com',
        pass: process.env.EMAIL_PASS // Your Gmail App Password
    }
});

// Test email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("Email configuration error:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Import routes and middleware
const bookingRoutes = require('./src/routes/bookingRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { authMiddleware, adminMiddleware } = require('./src/middleware/auth');

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/feedback', authMiddleware, feedbackRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Admin only routes
app.use('/api/admin/*', authMiddleware, adminMiddleware);

// Email routes (protected)
app.post('/api/send-booking-confirmation', authMiddleware, async (req, res) => {
    const { name, email, roomType, checkIn, checkOut, totalPrice } = req.body;

    const mailOptions = {
        from: '"Sunset Hotel" <sowdasheikh01@gmail.com>',
        to: email,
        subject: 'Booking Confirmation - Sunset Hotel',
        html: `
            <h2>Thank you for choosing Sunset Hotel!</h2>
            <p>Dear ${name},</p>
            <p>Your booking has been confirmed. Here are your booking details:</p>
            <ul>
                <li>Room Type: ${roomType}</li>
                <li>Check-in: ${new Date(checkIn).toLocaleDateString()}</li>
                <li>Check-out: ${new Date(checkOut).toLocaleDateString()}</li>
                <li>Total Price: ${totalPrice}</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>Sunset Hotel Team</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.json({ success: true, message: 'Booking confirmation email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// Feedback notification email
app.post('/api/send-feedback-notification', authMiddleware, async (req, res) => {
    const { name, email, rating, feedback } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to hotel email
        subject: 'New Guest Feedback - Sunset Hotel',
        html: `
            <h2>New Guest Feedback</h2>
            <p><strong>Guest Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Rating:</strong> ${rating}/5</p>
            <p><strong>Feedback:</strong></p>
            <p>${feedback}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Feedback notification sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Contact form email
app.post('/api/send-contact-email', authMiddleware, async (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to hotel email
        subject: `Contact Form: ${subject}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Contact email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

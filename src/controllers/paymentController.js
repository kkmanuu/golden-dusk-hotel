const admin = require("firebase-admin");
const db = admin.firestore();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentController = {
  // Create a payment intent
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, currency } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency || "usd",
        payment_method_types: ["card"],
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  },

  // Handle successful payment
  handleSuccessfulPayment: async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // Update booking status in Firestore
      const bookingRef = await db
        .collection("bookings")
        .doc(paymentIntent.metadata.bookingId);
      await bookingRef.update({
        paymentStatus: "paid",
        paymentId: paymentIntentId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: "Payment processed successfully" });
    } catch (error) {
      console.error("Error handling payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  },

  // Get payment history
  getPaymentHistory: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const paymentsSnapshot = await db
        .collection("payments")
        .where("bookingId", "==", bookingId)
        .get();

      const payments = [];
      paymentsSnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ error: "Failed to fetch payment history" });
    }
  },

  // Refund payment
  refundPayment: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const refund = await stripe.refunds.create({
        payment_intent: paymentId,
      });

      // Update payment status in Firestore
      const paymentRef = await db.collection("payments").doc(paymentId);
      await paymentRef.update({
        status: "refunded",
        refundId: refund.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ message: "Payment refunded successfully" });
    } catch (error) {
      console.error("Error refunding payment:", error);
      res.status(500).json({ error: "Failed to refund payment" });
    }
  },

  // Get payment status
  getPaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      res.json({ status: paymentIntent.status });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ error: "Failed to fetch payment status" });
    }
  },
};

module.exports = paymentController;

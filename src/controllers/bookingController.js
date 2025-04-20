const admin = require("firebase-admin");
const db = admin.firestore();

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const bookingData = req.body;
      const bookingRef = await db.collection("bookings").add({
        ...bookingData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
      });
      res
        .status(201)
        .json({ id: bookingRef.id, message: "Booking created successfully" });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  },

  // Get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookingsSnapshot = await db.collection("bookings").get();
      const bookings = [];
      bookingsSnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },

  // Get booking by ID
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const bookingDoc = await db.collection("bookings").doc(id).get();
      if (!bookingDoc.exists) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json({ id: bookingDoc.id, ...bookingDoc.data() });
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await db.collection("bookings").doc(id).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ message: "Booking status updated successfully" });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  },

  // Delete booking
  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("bookings").doc(id).delete();
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ error: "Failed to delete booking" });
    }
  },

  // Get bookings by date range
  getBookingsByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const bookingsSnapshot = await db
        .collection("bookings")
        .where("checkIn", ">=", new Date(startDate))
        .where("checkOut", "<=", new Date(endDate))
        .get();

      const bookings = [];
      bookingsSnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings by date range:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },
};

module.exports = bookingController;

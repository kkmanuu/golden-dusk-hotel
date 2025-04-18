const admin = require('firebase-admin');
const db = admin.firestore();

const feedbackController = {
    // Create a new feedback
    createFeedback: async (req, res) => {
        try {
            const feedbackData = req.body;
            const feedbackRef = await db.collection('feedback').add({
                ...feedbackData,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.status(201).json({ id: feedbackRef.id, message: 'Feedback submitted successfully' });
        } catch (error) {
            console.error('Error creating feedback:', error);
            res.status(500).json({ error: 'Failed to submit feedback' });
        }
    },

    // Get all feedback
    getAllFeedback: async (req, res) => {
        try {
            const feedbackSnapshot = await db.collection('feedback').get();
            const feedback = [];
            feedbackSnapshot.forEach(doc => {
                feedback.push({ id: doc.id, ...doc.data() });
            });
            res.json(feedback);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    },

    // Get feedback by ID
    getFeedbackById: async (req, res) => {
        try {
            const { id } = req.params;
            const feedbackDoc = await db.collection('feedback').doc(id).get();
            if (!feedbackDoc.exists) {
                return res.status(404).json({ error: 'Feedback not found' });
            }
            res.json({ id: feedbackDoc.id, ...feedbackDoc.data() });
        } catch (error) {
            console.error('Error fetching feedback:', error);
            res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    },

    // Update feedback
    updateFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const feedbackData = req.body;
            await db.collection('feedback').doc(id).update({
                ...feedbackData,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ message: 'Feedback updated successfully' });
        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({ error: 'Failed to update feedback' });
        }
    },

    // Delete feedback
    deleteFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            await db.collection('feedback').doc(id).delete();
            res.json({ message: 'Feedback deleted successfully' });
        } catch (error) {
            console.error('Error deleting feedback:', error);
            res.status(500).json({ error: 'Failed to delete feedback' });
        }
    },

    // Get feedback by rating
    getFeedbackByRating: async (req, res) => {
        try {
            const { rating } = req.query;
            const feedbackSnapshot = await db.collection('feedback')
                .where('rating', '==', parseInt(rating))
                .get();

            const feedback = [];
            feedbackSnapshot.forEach(doc => {
                feedback.push({ id: doc.id, ...doc.data() });
            });
            res.json(feedback);
        } catch (error) {
            console.error('Error fetching feedback by rating:', error);
            res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    }
};

module.exports = feedbackController;

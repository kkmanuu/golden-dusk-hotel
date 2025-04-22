const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Create a new feedback
router.post("/", feedbackController.createFeedback);

// Get all feedback
router.get("/", feedbackController.getAllFeedback);

// Get feedback by ID
router.get("/:id", feedbackController.getFeedbackById);

// Update feedback
router.patch("/:id", feedbackController.updateFeedback);

// Delete feedback
router.delete("/:id", feedbackController.deleteFeedback);

// Get feedback by rating
router.get("/rating", feedbackController.getFeedbackByRating);

module.exports = router;

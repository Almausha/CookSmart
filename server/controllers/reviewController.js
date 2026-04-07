const { Review } = require('../models/schema');

// GET all reviews for a recipe
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// POST add a review
const addReview = async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const { recipeId } = req.params;

    const existing = await Review.findOne({ recipeId, userId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this recipe' });
    }

    const review = new Review({ recipeId, userId, rating, comment });
    await review.save();

    const populated = await review.populate('userId', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.userId.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');

router.get('/:recipeId', getReviews);
router.post('/:recipeId', addReview);
router.delete('/:reviewId', deleteReview);

module.exports = router;

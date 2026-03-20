const express = require("express");
const router = express.Router();

// Controller import
const { getRecommendations } = require("../controllers/recipeRecommendController");

// Route: GET /api/recommend/:userId
router.get("/:userId", getRecommendations);

module.exports = router;

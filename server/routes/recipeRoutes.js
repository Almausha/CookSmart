const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Public recipes
router.get("/public", recipeController.getPublic);

// Pantry recommendations
router.get("/recommend/:userId", recipeController.getRecommend);

module.exports = router;

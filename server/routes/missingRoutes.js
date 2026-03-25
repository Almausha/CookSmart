const express = require("express");
const router = express.Router();
const missingController = require("../controllers/missingIngredientController");

// URL: /api/check-missing/:recipeId/:userId
router.get("/:recipeId/:userId", missingController.getMissingIngredients);

module.exports = router;
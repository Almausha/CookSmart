const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Routes
router.get('/', recipeController.getRecipes);
router.post('/', recipeController.createRecipe);

module.exports = router;
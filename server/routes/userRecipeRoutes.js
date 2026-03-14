const express = require("express");
const router = express.Router();

const userRecipeController = require("../controllers/userRecipeController");

router.get("/user-ingredients/:userId", userRecipeController.getUserAvailableIngredients);


router.post("/recipes", userRecipeController.createNewRecipe); 

module.exports = router;
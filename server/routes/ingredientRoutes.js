const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

router.get("/", ingredientController.getAllIngredients);
router.post("/", ingredientController.addIngredient);

module.exports = router;
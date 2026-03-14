const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");


router.post("/", recipeController.create);

router.get("/public", recipeController.getPublic);

router.get("/:id", recipeController.getById);

module.exports = router;
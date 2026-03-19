const express = require("express");
const router = express.Router();
const masterIngredientController = require("../controllers/masterIngredient.controller");

router.post("/", masterIngredientController.addMasterIngredient);
router.get("/", masterIngredientController.getMasterIngredients);
router.delete("/:id", masterIngredientController.deleteMasterIngredient);

module.exports = router;
const express = require("express");
const router = express.Router();
const pantryController = require("../controllers/pantryController");

// GET user's full pantry
router.get("/:userId", pantryController.getPantry);

// ADD ingredient to pantry (auto-adds to master list if new)
router.post("/:userId/add", pantryController.addIngredient);

// UPDATE quantity / expiry of a pantry item
router.put("/:userId/update/:ingredientId", pantryController.updateIngredient);

// DELETE ingredient from pantry
router.delete("/:userId/delete/:ingredientId", pantryController.deleteIngredient);

module.exports = router;
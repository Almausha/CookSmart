const PantryLogic = require("../models/pantryModel");

// GET /api/pantry/:userId
exports.getPantry = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await PantryLogic.getUserPantry(userId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/pantry/:userId/add
exports.addIngredient = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await PantryLogic.addToPantry(userId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/pantry/:userId/update/:ingredientId
exports.updateIngredient = async (req, res) => {
  try {
    const { userId, ingredientId } = req.params;
    const data = await PantryLogic.updatePantryItem(userId, ingredientId, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/pantry/:userId/delete/:ingredientId
exports.deleteIngredient = async (req, res) => {
  try {
    const { userId, ingredientId } = req.params;
    const data = await PantryLogic.deleteFromPantry(userId, ingredientId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
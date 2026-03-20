const MasterIngredientLogic = require("../models/MasterIngredient");

exports.addMasterIngredient = async (req, res) => {
  try {
    const result = await MasterIngredientLogic.create(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMasterIngredients = async (req, res) => {
  try {
    const result = await MasterIngredientLogic.getAll();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMasterIngredient = async (req, res) => {
  try {
    await MasterIngredientLogic.delete(req.params.id);
    res.status(200).json({ success: true, message: "Ingredient removed from master list" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
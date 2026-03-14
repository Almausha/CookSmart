const UserRecipeModel = require("../models/UserAddRecipe");


exports.getUserAvailableIngredients = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await UserRecipeModel.fetchUserPantryIngredients(userId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createNewRecipe = async (req, res) => {
  try {
    if (!req.body.title || !req.body.ownerId) {
      return res.status(400).json({ success: false, message: "Title and User ID are required" });
    }
    const data = await UserRecipeModel.saveUserRecipe(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Recipe Forged!", 
      data 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const Recipe = require("../models/Recipe");

// ১. রেসিপি তৈরি
exports.create = async (req, res) => {
  try {
    const data = req.body;

    // FR-18: Auto-calculate calories from macros
    const protein = data.nutrition?.protein || 0;
    const carbs   = data.nutrition?.carbs   || 0;
    const fat     = data.nutrition?.fat     || 0;
    const calories = (protein * 4) + (carbs * 4) + (fat * 9);

    // Inject calculated calories before saving
    data.nutrition = { protein, carbs, fat, calories };

    const recipe = await Recipe.createNewRecipe(data);
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
};


exports.getPublic = async (req, res) => {
  try {
    const data = await Recipe.fetchPublicRecipes();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public recipes", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Recipe.fetchRecipeById(req.params.id);
    if (!data) return res.status(404).json({ message: "Recipe not found!" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format or server error" });
  }
};
const Recipe = require("../models/Recipe");
const schemas = require("../models/schema");

// Admin: Create Recipe
exports.create = async (req, res) => {
  try {
    const data = await Recipe.createNewRecipe(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
};

// FR-20: Get Public Recipes with optional diet filter
exports.getPublic = async (req, res) => {
  try {
    const { diet } = req.query;

    let query = { isPublic: true };

    // If diet filter provided, filter by recipeTag
    if (diet && diet !== '') {
      const dietArray = diet.split(',').map(d => d.trim());
      query.recipeTag = { $in: dietArray };
    }

    const data = await schemas.Recipe.find(query)
      .populate("ingredients.ingredientId")
      .populate("ownerId", "name");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public recipes", error: err.message });
  }
};

// Get Recipe by ID
exports.getById = async (req, res) => {
  try {
    const data = await Recipe.fetchRecipeById(req.params.id);
    if (!data) return res.status(404).json({ message: "Recipe not found!" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format or server error" });
  }
};
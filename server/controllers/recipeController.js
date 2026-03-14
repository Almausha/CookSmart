const Recipe = require("../models/Recipe");

// ১. রেসিপি তৈরি
exports.create = async (req, res) => {
  try {
    const data = await Recipe.createNewRecipe(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
};

// ২. পাবলিক রেসিপি লিস্ট (যেটা /public রুটে কল হবে)
exports.getPublic = async (req, res) => {
  try {
    const data = await Recipe.fetchPublicRecipes();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public recipes", error: err.message });
  }
};

// ৩. আইডি দিয়ে রেসিপি ডিটেইলস
exports.getById = async (req, res) => {
  try {
    const data = await Recipe.fetchRecipeById(req.params.id);
    if (!data) return res.status(404).json({ message: "Recipe not found!" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format or server error" });
  }
};
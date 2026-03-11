const Recipe = require("../models/Recipe");

exports.getPublic = async (req, res) => {
  try {
    const data = await Recipe.fetchPublicRecipes();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Recipe.fetchRecommendations(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch recommendations" });
  }
};

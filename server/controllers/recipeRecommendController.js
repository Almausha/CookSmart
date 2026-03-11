const { getSmartRecommendations } = require("../models/recipeRecommend");

async function getRecommendations(req, res) {
  try {
    const { userId } = req.params;
    const data = await getSmartRecommendations(userId);
    res.status(200).json(data);
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).json({ message: "Server Error: Could not fetch recommendations" });
  }
}

module.exports = { getRecommendations };

// models/recipe.js
const schemas = require("./schema");

const fetchPublicRecipes = async () => {
  return await schemas.Recipe.find({ isPublic: true })
    .populate("ingredients.ingredientId")
    .populate("ownerId", "name");
};

const fetchRecommendations = async (userId) => {
  const userPantry = await schemas.Pantry.findOne({ userId });
  
  if (!userPantry || userPantry.ingredients.length === 0) return [];
  
  const ingredientIds = userPantry.ingredients.map(i => i.ingredientId);
  
  return await schemas.Recipe.find({ 
    "ingredients.ingredientId": { $in: ingredientIds } 
  }).populate("ingredients.ingredientId");
};

module.exports = { fetchPublicRecipes, fetchRecommendations };

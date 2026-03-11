const Recipe = require("./Recipe"); // capital R
const User = require("./authModel"); // assuming user model authModel.js

// Smart recommendation function
async function getSmartRecommendations(userId) {
  const user = await User.findById(userId);
  if (!user || !user.pantry) return [];

  const pantryItemIds = user.pantry.map(p => p.ingredientId.toString());

  const recipes = await Recipe.find({ isPublic: true }).populate('ingredients.ingredientId');

  const processedRecipes = recipes.map(recipe => {
    const requiredIngredients = recipe.ingredients;

    const available = requiredIngredients.filter(ing =>
      pantryItemIds.includes(ing.ingredientId._id.toString())
    );

    const missing = requiredIngredients.filter(ing =>
      !pantryItemIds.includes(ing.ingredientId._id.toString())
    );

    const matchPercentage = (available.length / requiredIngredients.length) * 100;

    return {
      ...recipe._doc,
      matchPercentage: Math.round(matchPercentage),
      missingCount: missing.length,
      missingIngredients: missing,
      isReady: missing.length === 0
    };
  });

  return processedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

module.exports = { getSmartRecommendations };

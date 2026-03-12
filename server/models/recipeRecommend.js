const { Recipe, Pantry } = require("./schema");

async function getSmartRecommendations(userId) {
  try {

    const userPantry = await Pantry.findOne({ userId }).populate("ingredients.ingredientId");
    
    if (!userPantry || !userPantry.ingredients || userPantry.ingredients.length === 0) {
      console.log("No Pantry found for user:", userId);
      return [];
    }

    const pantryItemIds = userPantry.ingredients
      .filter(ing => ing.ingredientId) // null check
      .map(ing => ing.ingredientId._id.toString());

    const recipes = await Recipe.find({ isPublic: true }).populate("ingredients.ingredientId");

    const processedRecipes = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients || [];
  
      const available = recipeIngredients.filter(ing => 
        ing.ingredientId && pantryItemIds.includes(ing.ingredientId._id.toString())
      );

      const isReady = available.length === recipeIngredients.length && recipeIngredients.length > 0;
      const matchPercentage = recipeIngredients.length ? (available.length / recipeIngredients.length) * 100 : 0;

      return {
        ...recipe._doc,
        matchPercentage: Math.round(matchPercentage),
        isReady: isReady
      };
    });

    return processedRecipes
      .filter(r => r.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

  } catch (error) {
    console.error("Internal Logic Error:", error);
    return [];
  }
}

module.exports = { getSmartRecommendations };
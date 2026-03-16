const schemas = require("./schema");
const mongoose = require("mongoose");

const fetchUserPantryIngredients = async (userId) => {
  try {
    const queryId = mongoose.Types.ObjectId.isValid(userId) 
                    ? new mongoose.Types.ObjectId(userId) 
                    : userId;

    const pantry = await schemas.Pantry.findOne({ userId: queryId })
      .populate({
        path: "ingredients.ingredientId",
        select: "name qualityType"
      });
    
    if (!pantry || !pantry.ingredients) return [];
    
    return pantry.ingredients
      .filter(item => item.ingredientId) 
      .map(item => ({
        _id: item.ingredientId._id,
        name: item.ingredientId.name,
        currentQuantity: item.currentQuantity
      }));
  } catch (err) {
    throw new Error(err.message);
  }
};

const saveUserRecipe = async (recipeData) => {
 
  const formattedIngredients = recipeData.ingredients.map(ing => ({
    ingredientId: ing.ingredientId,
    quantity: ing.quantity,
    substituteSuggestions: ing.substituteSuggestions || [] 
  }));

  const newRecipe = new schemas.Recipe({
    title: recipeData.title,
    difficulty: recipeData.difficulty || "easy",
    cookingTime: recipeData.cookingTime,
    videourl: recipeData.videourl || "",
    imageUrl: recipeData.imageUrl || "",
    steps: recipeData.steps.filter(step => step.trim() !== ""),
    ingredients: formattedIngredients,
    ownerId: recipeData.ownerId, 
    isPublic: true,
    nutrition: {
      calories: Number(recipeData.nutrition?.calories) || 0,
      protein: Number(recipeData.nutrition?.protein) || 0,
      carbs: Number(recipeData.nutrition?.carbs) || 0,
      fat: Number(recipeData.nutrition?.fat) || 0
    }
  });

  return await newRecipe.save();
};

module.exports = { fetchUserPantryIngredients, saveUserRecipe };
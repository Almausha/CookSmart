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
  try {
    // ইনগ্রিডিয়েন্টগুলোকে স্কিমা অনুযায়ী ফরম্যাট করা
    const formattedIngredients = recipeData.ingredients.map(ing => ({
      ingredientId: new mongoose.Types.ObjectId(ing.ingredientId),
      quantityValue: Number(ing.quantityValue) || 0, // স্কিমাতে নাম quantityValue
      unit: ing.unit || "g",
      substituteSuggestions: ing.substituteSuggestions || [] 
    }));

    const newRecipe = new schemas.Recipe({
      ownerId: new mongoose.Types.ObjectId(recipeData.ownerId),
      title: recipeData.title,
      difficulty: recipeData.difficulty || "easy",
      cookingTime: recipeData.cookingTime,
      videourl: recipeData.videourl || "",
      imageUrl: recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      steps: recipeData.steps.filter(step => step.trim() !== ""),
      ingredients: formattedIngredients,
      isPublic: true,
      nutrition: {
        calories: Number(recipeData.nutrition?.calories) || 0,
        protein: Number(recipeData.nutrition?.protein) || 0,
        carbs: Number(recipeData.nutrition?.carbs) || 0,
        fat: Number(recipeData.nutrition?.fat) || 0
      }
    });

    return await newRecipe.save();
  } catch (err) {
    throw new Error("Database Save Error: " + err.message);
  }
};

module.exports = { fetchUserPantryIngredients, saveUserRecipe };
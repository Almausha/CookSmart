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


    // FR-18/19: Unit to Gram conversion table
    const toGrams = (value, unit) => {
      const conversions = {
        g:    value,
        kg:   value * 1000,
        ml:   value,
        tsp:  value * 5,
        tbsp: value * 15,
        pcs:  value * 50,
      };
      return conversions[unit] || value;
    };

    // FR-18/19: Calculate total nutrition from ingredients
    let totalProtein  = 0;
    let totalCarbs    = 0;
    let totalFat      = 0;

    const formattedIngredients = [];

    for (const ing of recipeData.ingredients) {
      const masterIngredient = await schemas.Ingredient.findById(ing.ingredientId);
      const grams = toGrams(Number(ing.quantityValue) || 0, ing.unit || "g");
    
      console.log(`🧮 ${masterIngredient?.name}: ${grams}g → P:${masterIngredient?.protein} C:${masterIngredient?.carbs} F:${masterIngredient?.fat}`);
    
      if (masterIngredient) {
        totalProtein += (grams * (masterIngredient.protein || 0)) / 100;
        totalCarbs   += (grams * (masterIngredient.carbs   || 0)) / 100;
        totalFat     += (grams * (masterIngredient.fat     || 0)) / 100;
      }

      formattedIngredients.push({
        ingredientId:          new mongoose.Types.ObjectId(ing.ingredientId),
        quantityValue:         Number(ing.quantityValue) || 0,
        unit:                  ing.unit || "g",
        substituteSuggestions: ing.substituteSuggestions || []
      });
    }

    // FR-18: Auto-calculate calories from macros
    const totalCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);

    const newRecipe = new schemas.Recipe({
      ownerId:     new mongoose.Types.ObjectId(recipeData.ownerId),
      title:       recipeData.title,
      difficulty:  recipeData.difficulty || "easy",
      cookingTime: recipeData.cookingTime,
      videourl:    recipeData.videourl || "",
      imageUrl:    recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      steps:       recipeData.steps.filter(step => step.trim() !== ""),
      ingredients: formattedIngredients,
      isPublic:    true,
      nutrition: {
        calories: Math.round(totalCalories),
        protein:  Math.round(totalProtein),
        carbs:    Math.round(totalCarbs),
        fat:      Math.round(totalFat)
      }
    });

    return await newRecipe.save();

  } catch (err) {
    throw new Error("Database Save Error: " + err.message);
  }
};

module.exports = { fetchUserPantryIngredients, saveUserRecipe };
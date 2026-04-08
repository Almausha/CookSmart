const schemas = require("./schema");
const mongoose = require("mongoose");

/**
 * FR-18/19: Helper function to normalize various units to grams
 * This ensures nutrition is calculated based on a consistent base weight.
 */
const toGrams = (value, unit) => {
  const conversions = {
    g:    value,
    kg:   value * 1000,
    ml:   value, 
    tsp:  value * 5,
    tbsp: value * 15,
    pcs:  value * 50, // Standard estimated weight per piece
  };
  return conversions[unit] || value;
};

const saveUserRecipe = async (recipeData) => {
  try {
    let totalProtein  = 0;
    let totalCarbs    = 0;
    let totalFat      = 0;

    const formattedIngredients = [];

    // Loop through each ingredient to fetch master data and calculate macros
    for (const ing of recipeData.ingredients) {
      const masterIngredient = await schemas.Ingredient.findById(ing.ingredientId);
      
      if (masterIngredient) {
        // Convert quantity to grams for nutrition math
        const grams = toGrams(Number(ing.quantityValue) || 0, ing.unit || "g");
        
        // Calculate nutrition based on 100g base from the Master Ingredient list
        const factor = grams / 100;

        totalProtein += (masterIngredient.protein || 0) * factor;
        totalCarbs   += (masterIngredient.carbs   || 0) * factor;
        totalFat     += (masterIngredient.fat     || 0) * factor;

        formattedIngredients.push({
          ingredientId:          new mongoose.Types.ObjectId(ing.ingredientId),
          quantityValue:         Number(ing.quantityValue) || 0,
          unit:                  ing.unit || "g",
          substituteSuggestions: ing.substituteSuggestions || []
        });
      }
    }

    // FR-18: Auto-calculate calories using the 4-4-9 method
    const totalCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);

    const newRecipe = new schemas.Recipe({
      ownerId:     new mongoose.Types.ObjectId(recipeData.ownerId),
      title:       recipeData.title,
      difficulty:  recipeData.difficulty || "easy",
      cookingTime: recipeData.cookingTime,
      videourl:    recipeData.videourl || "",
      imageUrl:    recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      steps:       recipeData.steps ? recipeData.steps.filter(step => step.trim() !== "") : [],
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

module.exports = { saveUserRecipe };
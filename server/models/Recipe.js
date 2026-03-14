const schemas = require("./schema");

// ১. পাবলিক রেসিপি লিস্ট আনা (তোমার আগের কোড)
const fetchPublicRecipes = async () => {
  return await schemas.Recipe.find({ isPublic: true })
    .populate("ingredients.ingredientId")
    .populate("ownerId", "name");
};

// ২. প্যান্ট্রি অনুযায়ী রিকমেন্ডেশন (তোমার আগের কোড)
const fetchRecommendations = async (userId) => {
  const userPantry = await schemas.Pantry.findOne({ userId });
  if (!userPantry || userPantry.ingredients.length === 0) return [];
  const ingredientIds = userPantry.ingredients.map(i => i.ingredientId);
  return await schemas.Recipe.find({ 
    "ingredients.ingredientId": { $in: ingredientIds } 
  }).populate("ingredients.ingredientId");
};


const fetchRecipeById = async (id) => {
  return await schemas.Recipe.findById(id)
    .populate("ingredients.ingredientId")
    .populate("ownerId", "name");
};

const createNewRecipe = async (recipeData) => {
  const newRecipe = new schemas.Recipe({
    ...recipeData,
    imageUrl: recipeData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } // ডিফল্ট ক্যালকুলেশন
  });
  return await newRecipe.save();
};

module.exports = { 
  fetchPublicRecipes, 
  fetchRecommendations, 
  fetchRecipeById,
  createNewRecipe 
};
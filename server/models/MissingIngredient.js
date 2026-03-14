const schemas = require("./schema");

const getMissingLogic = async (recipeId, userId) => {
    // ১. রেসিপি এবং প্যান্ট্রি ডাটা খুঁজে বের করা
    const recipe = await schemas.Recipe.findById(recipeId).populate("ingredients.ingredientId");
    const userPantry = await schemas.Pantry.findOne({ userId });

    if (!recipe) throw new Error("Recipe not found");

    // ২. প্যান্ট্রিতে থাকা ইনগ্রেডিয়েন্ট আইডিগুলোর একটি লিস্ট (String Array) তৈরি করা
    const pantryIngIds = userPantry 
        ? userPantry.ingredients.map(i => i.ingredientId.toString()) 
        : [];

    // ৩. রেসিপির ইনগ্রেডিয়েন্টগুলোর সাথে প্যান্ট্রির তুলনা করা
    const missing = recipe.ingredients.filter(ing => {
        // যদি ইনগ্রেডিয়েন্ট অবজেক্ট হয় তবে আইডি বের করা, নাহলে সরাসরি আইডি নেওয়া
        const recipeIngId = ing.ingredientId._id 
            ? ing.ingredientId._id.toString() 
            : ing.ingredientId.toString();
            
        return !pantryIngIds.includes(recipeIngId);
    });

    return {
        missing,
        isReady: missing.length === 0,
        missingCount: missing.length
    };
};

module.exports = { getMissingLogic };
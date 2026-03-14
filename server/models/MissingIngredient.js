const schemas = require("./schema");

const getMissingLogic = async (recipeId, userId) => {
   
    const recipe = await schemas.Recipe.findById(recipeId).populate("ingredients.ingredientId");
    const userPantry = await schemas.Pantry.findOne({ userId });

    if (!recipe) throw new Error("Recipe not found");

    const pantryIngIds = userPantry 
        ? userPantry.ingredients.map(i => i.ingredientId.toString()) 
        : [];

    const missing = recipe.ingredients.filter(ing => {
    
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
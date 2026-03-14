const MissingModel = require("../models/MissingIngredient");

exports.getMissingIngredients = async (req, res) => {
    try {
        const { recipeId, userId } = req.params;
        
        // মডেল ফাংশন কল করা
        const data = await MissingModel.getMissingLogic(recipeId, userId);
        
        res.status(200).json(data);
    } catch (err) {
        console.error("Missing Ingredient Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};
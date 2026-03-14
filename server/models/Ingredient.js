const mongoose = require("mongoose");
const { Ingredient } = require("./schema"); // তোমার মেইন স্কিমা ফাইল থেকে ইম্পোর্ট

// বিজনেস লজিক সরাসরি মডেলে
exports.getAllIngredientsLogic = async () => {
    return await Ingredient.find().sort({ name: 1 });
};

exports.addIngredientLogic = async (name) => {
    // Case-insensitive চেক
    const existing = await Ingredient.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existing) throw new Error("Ingredient already exists");

    const newIng = new Ingredient({ name });
    return await newIng.save();
};
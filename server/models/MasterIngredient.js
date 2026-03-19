const { Ingredient } = require("./schema");

// models/MasterIngredient.js

const MasterIngredientLogic = {
  create: async (data) => {
    const existing = await Ingredient.findOne({ name: data.name });
    if (existing) throw new Error("Ingredient already exists in Master List");
    
    const newIngredient = new Ingredient({
      name: data.name,
      // data.calories যদি না থাকে তবেই ০ হবে
      calories: 0, 
      protein: data.protein || 0,
      carbs: data.carbs || 0,
      fat: data.fat || 0,
      unit: data.unit || "g",
      qualityType: data.qualityType || "fresh",
      isAllergen: data.isAllergen || false,
      healthBenefits: data.healthBenefits || [],
      risks: data.risks || []
    });
    return await newIngredient.save();
  },
  

  getAll: async () => {
    return await Ingredient.find().sort({ name: 1 });
  },

  delete: async (id) => {
    return await Ingredient.findByIdAndDelete(id);
  }
};

module.exports = MasterIngredientLogic;
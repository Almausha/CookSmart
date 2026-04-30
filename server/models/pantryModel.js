const { Pantry, Ingredient } = require("./schema");
const mongoose = require("mongoose");

// GET user's pantry with full ingredient details
const getUserPantry = async (userId) => {
  try {
    const pantry = await Pantry.findOne({ userId })
      .populate({
        path: "ingredients.ingredientId",
        select: "name calories protein carbs fat unit qualityType isAllergen healthBenefits risks"
      });

    if (!pantry) return { ingredients: [] };

    // Filter out orphaned refs (deleted master ingredients)
    const validIngredients = pantry.ingredients.filter(
      (item) => item.ingredientId !== null && item.ingredientId !== undefined
    );

    return { ingredients: validIngredients };
  } catch (err) {
    throw new Error("Failed to fetch pantry: " + err.message);
  }
};

// ADD ingredient to pantry (also adds to master if not exists)
const addToPantry = async (userId, ingredientData) => {
  try {
    const {
      name,
      currentQuantity,
      unit,
      expiryDate,
      qualityType,
      calories,
      protein,
      carbs,
      fat,
      isAllergen,
      healthBenefits,
      risks,
    } = ingredientData;

    // Step 1: Find or create in master ingredient list
    let masterIngredient = await Ingredient.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!masterIngredient) {
      masterIngredient = new Ingredient({
        name,
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        unit: unit || "g",
        qualityType: qualityType || "fresh",
        isAllergen: isAllergen || false,
        healthBenefits: healthBenefits || [],
        risks: risks || [],
      });
      await masterIngredient.save();
    }

    // Step 2: Find or create pantry for user
    let pantry = await Pantry.findOne({ userId });
    if (!pantry) {
      pantry = new Pantry({ userId, ingredients: [] });
    }

    // Step 3: Check if already in pantry
    const existingIdx = pantry.ingredients.findIndex(
      (i) => i.ingredientId && i.ingredientId.toString() === masterIngredient._id.toString()
    );

    if (existingIdx !== -1) {
      // Update quantity if already exists
      pantry.ingredients[existingIdx].currentQuantity += Number(currentQuantity) || 0;
      if (expiryDate) pantry.ingredients[existingIdx].expiryDate = expiryDate;
    } else {
      pantry.ingredients.push({
        ingredientId: masterIngredient._id,
        currentQuantity: Number(currentQuantity) || 0,
        unit: unit || "g",
        expiryDate: expiryDate || null,
      });
    }

    await pantry.save();

    // Return populated pantry item
    const updated = await Pantry.findOne({ userId }).populate({
      path: "ingredients.ingredientId",
      select: "name calories protein carbs fat unit qualityType isAllergen healthBenefits risks",
    });

    return updated;
  } catch (err) {
    throw new Error("Failed to add to pantry: " + err.message);
  }
};

// UPDATE pantry item (quantity, expiry)
const updatePantryItem = async (userId, ingredientId, updateData) => {
  try {
    const pantry = await Pantry.findOne({ userId });
    if (!pantry) throw new Error("Pantry not found");

    const itemIdx = pantry.ingredients.findIndex(
      (i) => i.ingredientId && i.ingredientId.toString() === ingredientId
    );

    if (itemIdx === -1) throw new Error("Ingredient not found in pantry");

    if (updateData.currentQuantity !== undefined) {
      pantry.ingredients[itemIdx].currentQuantity = Number(updateData.currentQuantity);
    }
    if (updateData.unit !== undefined) {
      pantry.ingredients[itemIdx].unit = updateData.unit;
    }
    if (updateData.expiryDate !== undefined) {
      pantry.ingredients[itemIdx].expiryDate = updateData.expiryDate;
    }

    await pantry.save();
    return pantry;
  } catch (err) {
    throw new Error("Failed to update pantry item: " + err.message);
  }
};

// DELETE ingredient from pantry
const deleteFromPantry = async (userId, ingredientId) => {
  try {
    const pantry = await Pantry.findOne({ userId });
    if (!pantry) throw new Error("Pantry not found");

    pantry.ingredients = pantry.ingredients.filter(
      (i) => i.ingredientId && i.ingredientId.toString() !== ingredientId
    );

    await pantry.save();
    return { message: "Ingredient removed from pantry" };
  } catch (err) {
    throw new Error("Failed to delete from pantry: " + err.message);
  }
};

module.exports = {
  getUserPantry,
  addToPantry,
  updatePantryItem,
  deleteFromPantry,
};
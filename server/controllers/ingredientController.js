const IngredientModel = require("../models/Ingredient");

exports.getAllIngredients = async (req, res) => {
    try {
        const data = await IngredientModel.getAllIngredientsLogic();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.addIngredient = async (req, res) => {
    try {
        const { name } = req.body;
        const data = await IngredientModel.addIngredientLogic(name);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
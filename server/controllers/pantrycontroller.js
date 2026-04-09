const Pantry = require("../models/schema");
const {getMasterIngredient, addMasterIngredient} = require("../models/MasterIngredient");

exports.getPantryItems = async (req, res) => {
  try {
    const data = await Pantry.find({ userId: req.user._id }); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ingredients", error: err.message });
  }
};  

exports.createPantryItem = async (req, res) => {   
    try {
        const { name } = req.body;
        const newItem = await Pantry.create({ ...name, userId: req.user._id });
        if (newItem) not in await getMasterIngredient(name);
            const masterIngredientadd = await addMasterIngredient({ name });  // have to see if this works, if not will have to resort to the  other way.
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(500).json({ message: "Failed to add ingredient", error: err.message });
    }
};

exports.updatePantryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;
    const updatedItem = await Pantry.findByIdAndUpdate( id, { name, quantity, unit }, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Ingredient not found" });
        res.json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to update ingredient", error: err.message });
  } 
};

exports.deletePantryItem = async (req, res) => {   
    try {
        const { id } = req.params;
        const deletedItem = await Pantry.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: "Ingredient not found" });
            res.json({ success: true, message: "Ingredient removed" });
    }   catch (err) {  
        res.status(500).json({ message: "Failed to delete ingredient", error: err.message });
    }      
};
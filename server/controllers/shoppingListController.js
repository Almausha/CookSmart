const { ShoppingList } = require('../models/schema');

// GET shopping list for a user
const getShoppingList = async (req, res) => {
  try {
    let list = await ShoppingList.findOne({ userId: req.params.userId });
    if (!list) {
      list = new ShoppingList({ userId: req.params.userId, ingredients: [] });
      await list.save();
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shopping list', error: err.message });
  }
};

// POST add missing ingredients to shopping list
const addToShoppingList = async (req, res) => {
  try {
    const { userId, ingredients } = req.body;

    let list = await ShoppingList.findOne({ userId });
    if (!list) {
      list = new ShoppingList({ userId, ingredients: [] });
    }

    // Add only ingredients that aren't already in the list
    ingredients.forEach((newItem) => {
      const exists = list.ingredients.some(i => i.name === newItem.name);
      if (!exists) {
        list.ingredients.push({
          name: newItem.name,
          quantity: newItem.quantity || '1',
          isPurchased: false,
          externalLink: newItem.externalLink || ''
        });
      }
    });

    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to shopping list', error: err.message });
  }
};

// PUT toggle purchased status
const togglePurchased = async (req, res) => {
  try {
    const { userId, ingredientId } = req.body;
    const list = await ShoppingList.findOne({ userId });
    if (!list) return res.status(404).json({ message: 'Shopping list not found' });

    const item = list.ingredients.id(ingredientId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isPurchased = !item.isPurchased;
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle item', error: err.message });
  }
};

// DELETE remove one item from shopping list
const removeItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const list = await ShoppingList.findOne({ userId });
    if (!list) return res.status(404).json({ message: 'Shopping list not found' });

    list.ingredients = list.ingredients.filter(
      i => i._id.toString() !== req.params.ingredientId
    );
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

// DELETE clear entire shopping list
const clearShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findOne({ userId: req.params.userId });
    if (!list) return res.status(404).json({ message: 'Shopping list not found' });

    list.ingredients = [];
    await list.save();
    res.status(200).json({ message: 'Shopping list cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear shopping list', error: err.message });
  }
};

module.exports = { getShoppingList, addToShoppingList, togglePurchased, removeItem, clearShoppingList };

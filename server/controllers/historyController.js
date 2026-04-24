const { History, Recipe } = require('../models/schema');

// Save a recipe to user's cooking history
const saveHistory = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // Check if already exists
    const existing = await History.findOne({ userId, recipeId });
    if (existing) {
      existing.lastVisited = new Date();
      await existing.save();
      return res.status(200).json(existing);
    }

    const history = new History({
      userId,
      recipeId,
      cookedDate: new Date(),
      lastVisited: new Date(),
    });

    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save history', error: err.message });
  }
};

// GET user's cooking history
const getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId })
      .populate('recipeId', 'title imageUrl cookingTime difficulty')
      .sort({ lastVisited: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

// DELETE a history item
const deleteHistory = async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.historyId);
    res.status(200).json({ message: 'History deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete history', error: err.message });
  }
};

module.exports = { saveHistory, getUserHistory, deleteHistory };

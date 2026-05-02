const User = require('../models/Schema').User;
const Recipe = require('../models/Schema').Recipe;


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')                    
      .sort({ createdAt: -1 });
    console.log('Fetched users from DB:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET /api/admin/users/:id — single user detail
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// DELETE /api/admin/users/:id — remove a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// GET /api/admin/activity — recent user-recipe activity
exports.getRecentActivity = async (req, res) => {
  try {
    const recentRecipes = await Recipe.find({})
      .populate('ownerId', 'name email')    // pull in user name + email
      .sort({ createdAt: -1 })
      .limit(20);

    const activity = recentRecipes.map(recipe => ({
    userName:    recipe.ownerId?.name  || 'Unknown',
    userEmail:   recipe.ownerId?.email || '',
    recipeTitle: recipe.title,
    action:      recipe.isPublic ? 'created' : 'saved', // derived
    timestamp:   recipe.createdAt,
    }));

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activity', error: err.message });
  }
};
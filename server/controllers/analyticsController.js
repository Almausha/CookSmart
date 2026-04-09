const { User, Recipe, Review, History } = require('../models/schema');

const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalRecipes, totalReviews, totalHistory] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Review.countDocuments(),
      History.countDocuments(),
    ]);

    // Most cooked recipes
    const mostCooked = await History.aggregate([
      { $group: { _id: '$recipeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'recipes', localField: '_id', foreignField: '_id', as: 'recipe' } },
      { $unwind: '$recipe' },
      { $project: { title: '$recipe.title', imageUrl: '$recipe.imageUrl', count: 1 } }
    ]);

    // Top rated recipes
    const topRated = await Review.aggregate([
      { $group: { _id: '$recipeId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'recipes', localField: '_id', foreignField: '_id', as: 'recipe' } },
      { $unwind: '$recipe' },
      { $project: { title: '$recipe.title', imageUrl: '$recipe.imageUrl', avgRating: 1, count: 1 } }
    ]);

    res.status(200).json({
      totalUsers,
      totalRecipes,
      totalReviews,
      totalHistory,
      mostCooked,
      topRated,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

module.exports = { getAnalytics };

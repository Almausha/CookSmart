const Post = require('../models/Post');

// 1. GET all posts (Global Feed) - Populated with nutrition data
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("recipeId") 
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

// 2. GET posts by a specific user (User Profile)
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId: userId })
      .populate("recipeId")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile posts', error: err.message });
  }
};

// 3. POST create a new post
const createPost = async (req, res) => {
  try {
    const { userId, username, title, description, imageUrl, recipeId, tags } = req.body;
    const post = new Post({ userId, username, title, description, imageUrl, recipeId, tags });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

// 4. PUT toggle like / unlike
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { userId } = req.body;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like', error: err.message });
  }
};

// 5. POST add a comment
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { userId, username, text } = req.body;
    post.comments.push({ userId, username, text });
    await post.save();

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

// 6. PUT increment share count
const sharePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { sharesCount: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ sharesCount: post.sharesCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to share post', error: err.message });
  }
};

// 7. DELETE a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { userId } = req.body;
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

module.exports = { 
  getAllPosts, 
  getUserPosts, 
  createPost, 
  toggleLike, 
  addComment, 
  sharePost, 
  deletePost 
};
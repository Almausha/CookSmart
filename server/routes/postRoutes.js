const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getUserPosts,
  createPost,
  toggleLike,
  addComment,
  sharePost,
  deletePost
} = require('../controllers/postController');

router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);
router.post('/', createPost);
router.put('/:id/like', toggleLike);
router.post('/:id/comment', addComment);
router.put('/:id/share', sharePost);
router.delete('/:id', deletePost);

module.exports = router;

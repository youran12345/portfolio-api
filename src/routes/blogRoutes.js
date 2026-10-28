const router = require('express').Router();
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const {
  getComments,
  createComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/protect');

// /api/blog
router
  .route('/')
  .get(getBlogPosts)
  .post(protect, createBlogPost);

// /api/blog/:id
router
  .route('/:id')
  .get(getBlogPost)
  .put(protect, updateBlogPost)
  .delete(protect, deleteBlogPost);

// /api/blog/:postId/comments
router
  .route('/:postId/comments')
  .get(getComments)
  .post(protect, createComment);

module.exports = router;

const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

/**
 * @desc    Get all comments for a specific blog post
 * @route   GET /api/blog/:postId/comments
 * @access  Public
 */
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort('createdAt');
    res.json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a comment on a blog post
 * @route   POST /api/blog/:postId/comments
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    if (!req.body.body || !req.body.body.trim()) {
      res.status(400);
      throw new Error('Comment body is required');
    }

    const comment = await Comment.create({
      body: req.body.body,
      author: req.user._id,
      post: post._id,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment };

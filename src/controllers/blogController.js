const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

/**
 * @desc    Get all blog posts (populated with author username)
 * @route   GET /api/blog
 * @access  Public
 */
const getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find({})
      .populate('author', 'username')
      .sort('-createdAt');
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single post (author + all associated comments)
 * @route   GET /api/blog/:id
 * @access  Public
 */
const getBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate(
      'author',
      'username'
    );
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username')
      .sort('createdAt');

    res.json({ success: true, data: { ...post.toObject(), comments } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a blog post (associated with logged-in user)
 * @route   POST /api/blog
 * @access  Private
 */
const createBlogPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Title and content are required');
    }

    const post = await BlogPost.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a blog post (only the author)
 * @route   PUT /api/blog/:id
 * @access  Private & Authorized
 */
const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    // Authorization: only the original author may update
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this post');
    }

    post.title = req.body.title !== undefined ? req.body.title : post.title;
    post.content =
      req.body.content !== undefined ? req.body.content : post.content;

    const updated = await post.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog post (only the author)
 * @route   DELETE /api/blog/:id
 * @access  Private & Authorized
 */
const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    // Authorization: only the original author may delete
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: post._id });

    res.json({ success: true, message: 'Blog post removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};

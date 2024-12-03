// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Utility function to build nested comments
const buildCommentsTree = (posts, parentId = null) => {
  const tree = [];
  posts.filter(post => String(post.parent) === String(parentId))
    .forEach(post => {
      const children = buildCommentsTree(posts, post._id);
      tree.push({
        ...post.toObject(),
        replies: children,
      });
    });
  return tree;
};

// @route   POST /api/posts
// @desc    Create a root post or reply to an existing post
// @access  Public
router.post('/', async (req, res) => {
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    // In POST /api/posts
    const newPost = new Post({
    content,
    parent: parentId || null,
    sessionId: req.session.id,
  });
  

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/posts
// @desc    Get paginated root posts
// @access  Public
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, sort = 'desc' } = req.query;

  try {
    const posts = await Post.find({ parent: null })
      .sort({ timestamp: sort === 'asc' ? 1 : -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Post.countDocuments({ parent: null });

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/posts/:id/comments
// @desc    Get nested comments for a post
// @access  Public
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const allComments = await Post.find({}).sort({ timestamp: 1 }); // Adjust sort as needed
    const commentsTree = buildCommentsTree(allComments, id);
    res.json(commentsTree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Public
router.post('/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/posts/:id/dislike
// @desc    Dislike a post
// @access  Public
router.post('/:id/dislike', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/posts/:id
// @desc    Edit a post's content
// @access  Public (since anonymous, implement session-based restrictions)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // For anonymous editing, you might track session IDs or use temporary tokens
    // Here, we'll allow editing without restrictions for simplicity
    post.content = content;
    post.edited = true;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletePostAndReplies = async (postId) => {
      const replies = await Post.find({ parent: postId });
      for (let reply of replies) {
        await deletePostAndReplies(reply._id);
      }
      await Post.findByIdAndDelete(postId);
    };

    await deletePostAndReplies(id);
    res.json({ message: 'Post and its replies deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = 'You need to be logged in to access this page';
    return res.redirect('/auth/login');
  }
  next();
};

// Check if user is the author of the post
const requireAuthor = async (req, res, next) => {
  try {
    const Post = require('../models/Post');
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      req.session.error = 'Post not found';
      return res.redirect('/posts');
    }
    
    if (post.author._id.toString() !== req.session.user._id) {
      req.session.error = 'You are not authorized to perform this action';
      return res.redirect('/posts');
    }
    
    next();
  } catch (error) {
    console.error(error);
    req.session.error = 'Server error';
    res.redirect('/posts');
  }
};

module.exports = {
  requireAuth,
  requireAuthor
};
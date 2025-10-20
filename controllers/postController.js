const Post = require('../models/Post');
const mongoose = require('mongoose');

const postController = {
  // Get all posts
  getAllPosts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPosts = await Post.countDocuments();
      const totalPages = Math.ceil(totalPosts / limit);

      res.render('pages/index', {
        title: 'Blog Platform',
        posts,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      });
    } catch (error) {
      console.error('Error getting posts:', error);
      req.session.error = 'Failed to load posts';
      res.redirect('/');
    }
  },

  // Get single post
  getSinglePost: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.session.error = 'Invalid post ID';
        return res.redirect('/posts');
      }

      const post = await Post.findById(req.params.id)
        .populate('author', 'username');
      
      if (!post) {
        req.session.error = 'Post not found';
        return res.redirect('/posts');
      }

      res.render('pages/post', {
        title: post.title,
        post
      });
    } catch (error) {
      console.error('Error getting post:', error);
      req.session.error = 'Failed to load post';
      res.redirect('/posts');
    }
  },

  // Show new post form
  showNewPost: (req, res) => {
    res.render('pages/new-post', { 
      title: 'Create New Post',
      post: {}
    });
  },

  // Create new post
  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;

      const post = new Post({
        title,
        content,
        author: req.session.user._id
      });

      await post.save();

      req.session.success = 'Post created successfully!';
      res.redirect(`/posts/${post._id}`);

    } catch (error) {
      console.error('Error creating post:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        req.session.error = messages.join(', ');
      } else {
        req.session.error = 'Failed to create post';
      }
      res.redirect('/posts/new');
    }
  },

  // Show edit post form
  showEditPost: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.session.error = 'Invalid post ID';
        return res.redirect('/posts');
      }

      const post = await Post.findById(req.params.id)
        .populate('author', 'username');
      
      if (!post) {
        req.session.error = 'Post not found';
        return res.redirect('/posts');
      }

      // Authorization check
      if (req.session.user._id !== post.author._id.toString()) {
        req.session.error = 'You are not authorized to edit this post';
        return res.redirect('/posts');
      }

      res.render('pages/edit-post', {
        title: 'Edit Post',
        post
      });
    } catch (error) {
      console.error('Error loading post for edit:', error);
      req.session.error = 'Failed to load post for editing';
      res.redirect('/posts');
    }
  },

  // Update post
  updatePost: async (req, res) => {
    try {
      const { title, content } = req.body;
      
      const existingPost = await Post.findById(req.params.id);
      
      if (!existingPost) {
        req.session.error = 'Post not found';
        return res.redirect('/posts');
      }

      // Authorization check
      if (req.session.user._id !== existingPost.author._id.toString()) {
        req.session.error = 'You are not authorized to edit this post';
        return res.redirect('/posts');
      }

      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { title, content, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('author', 'username');

      req.session.success = 'Post updated successfully!';
      res.redirect(`/posts/${post._id}`);

    } catch (error) {
      console.error('Error updating post:', error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        req.session.error = messages.join(', ');
      } else {
        req.session.error = 'Failed to update post';
      }
      res.redirect(`/posts/${req.params.id}/edit`);
    }
  },

  // Delete post - FIXED VERSION
  deletePost: async (req, res) => {
    try {
      console.log('🔄 Delete request for post:', req.params.id);
      console.log('👤 User attempting delete:', req.session.user._id);

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.session.error = 'Invalid post ID';
        return res.redirect('/posts');
      }

      const post = await Post.findById(req.params.id);
      
      if (!post) {
        console.log('❌ Post not found');
        req.session.error = 'Post not found';
        return res.redirect('/posts');
      }

      console.log('📝 Post author:', post.author.toString());

      // Authorization check - compare string values
      if (post.author.toString() !== req.session.user._id) {
        console.log('❌ Authorization failed');
        req.session.error = 'You are not authorized to delete this post';
        return res.redirect('/posts');
      }

      // Delete the post
      await Post.findByIdAndDelete(req.params.id);
      console.log('✅ Post deleted successfully');

      req.session.success = 'Post deleted successfully!';
      res.redirect('/posts');

    } catch (error) {
      console.error('❌ Error deleting post:', error);
      req.session.error = 'Failed to delete post: ' + error.message;
      res.redirect('/posts');
    }
  }
};

module.exports = postController;
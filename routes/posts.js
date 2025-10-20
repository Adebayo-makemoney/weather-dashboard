const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth, requireAuthor } = require('../middleware/authMiddleware');

// All posts page
router.get('/', postController.getAllPosts);

// NEW POST ROUTES
router.get('/new', requireAuth, postController.showNewPost);
router.post('/', requireAuth, postController.createPost);

// SHOW SINGLE POST
router.get('/:id', postController.getSinglePost);

// EDIT POST ROUTES
router.get('/:id/edit', requireAuth, requireAuthor, postController.showEditPost);

// UPDATE POST ROUTES - BOTH PUT AND POST
router.put('/:id', requireAuth, requireAuthor, postController.updatePost);
router.post('/:id/update', requireAuth, requireAuthor, postController.updatePost);

// DELETE POST ROUTES - BOTH DELETE AND POST
router.delete('/:id', requireAuth, requireAuthor, postController.deletePost);
router.post('/:id/delete', requireAuth, requireAuthor, postController.deletePost);

module.exports = router;
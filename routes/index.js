const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Home page - show all posts
router.get('/', postController.getAllPosts);

module.exports = router;
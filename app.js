require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// EJS Layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  req.session.success = null;
  req.session.error = null;
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.get('/debug-posts', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const posts = await Post.find().populate('author', 'username');
    
    res.json({
      totalPosts: posts.length,
      posts: posts
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.redirect('/posts');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).render('pages/error', { 
    title: 'Server Error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
const User = require('../models/User');

const authController = {
  // Show registration form
  showRegister: (req, res) => {
    res.render('pages/register', { title: 'Register' });
  },

  // Handle registration
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (password !== confirmPassword) {
        req.session.error = 'Passwords do not match';
        return res.redirect('/auth/register');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        req.session.error = 'User with this email or username already exists';
        return res.redirect('/auth/register');
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      req.session.success = 'Registration successful! Please log in.';
      res.redirect('/auth/login');

    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        req.session.error = messages.join(', ');
      } else {
        req.session.error = 'Registration failed. Please try again.';
      }
      res.redirect('/auth/register');
    }
  },

  // Show login form
  showLogin: (req, res) => {
    res.render('pages/login', { title: 'Login' });
  },

  // Handle login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
    
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        req.session.error = 'Invalid email or password';
        return res.redirect('/auth/login');
      }
    
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.session.error = 'Invalid email or password';
        return res.redirect('/auth/login');
      }
    
      // Store user in session (without password)
      req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email
      };
    
      console.log('✅ User logged in:', user.username);
      console.log('🔄 Redirecting to /posts');
      
      req.session.success = `Welcome back, ${user.username}!`;
      res.redirect('/posts'); // Make sure this redirects to /posts
    
    } catch (error) {
      console.error('❌ Login error:', error);
      req.session.error = 'Login failed. Please try again.';
      res.redirect('/auth/login');
    }
  },

  // Handle logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/');
    });
  }
};

module.exports = authController;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Debug: Check if controller is loaded
console.log('🔍 authController using userController methods:', 
  userController.loginUser ? '✅ loginUser found' : '❌ loginUser missing');

// Auth routes
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser); // Optional

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

// Debug: Log registered routes
console.log('📋 Auth routes registered:');
router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} /api/auth${layer.route.path}`);
  }
});

module.exports = router;
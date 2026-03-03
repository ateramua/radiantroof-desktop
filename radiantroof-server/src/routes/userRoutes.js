const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Debug: Check if controller is loaded correctly
console.log('🔍 userController loaded:', Object.keys(userController));

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

// Add the missing register route
router.post('/register', userController.create);  // <-- ADD THIS LINE

// User routes
router.post('/', userController.createUser);  // CREATE
router.get('/', userController.getUsers);      // READ ALL
router.get('/:id', userController.getUserById); // READ ONE
router.put('/:id', userController.updateUser);  // UPDATE
router.delete('/:id', userController.deleteUser); // DELETE
router.post('/login', userController.loginUser); // LOGIN

// Debug: Log all registered routes
console.log('📋 User routes registered:');
router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} /api/users${layer.route.path}`);
  }
});

module.exports = router;
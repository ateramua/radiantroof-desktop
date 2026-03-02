const express = require('express');
const router = express.Router();
const countyController = require('../controllers/countyController');

// Public routes - NO AUTH REQUIRED (since you removed auth.js)
router.get('/counties', countyController.getCounties);
router.get('/fetch/:countyId', countyController.fetchExpiredListings);
router.get('/properties/:countyId', countyController.fetchProperties);

// Comment out routes that need controllers we don't have yet
// router.post('/import', countyController.importProperty);
// router.post('/batch-import', countyController.batchImport);
// router.post('/counties', countyController.addCounty);

// Debug: Log registered routes
console.log('📋 County routes registered:');
router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} /api/county${layer.route.path}`);
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const User = require('../models/User'); // or whatever models you need

// Create a reusable database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })


console.log('📋 [routes/admin.js] Loading admin routes...');

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Admin router is working!" });
});


// Add this at the bottom of your admin.js file
router.get("/debug-all-routes", (req, res) => {
    const routes = [];
    
    // Get all routes from the router
    router.stack.forEach((layer) => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            const path = layer.route.path;
            routes.push({ methods, path: `/admin${path}` });
        }
    });
    
    res.json({
        message: "All registered admin routes",
        routes: routes,
        total: routes.length
    });
});

// Get all users
  router.get('/users', (req, res) => {
  console.log('\n👮‍♂️ [routes/admin.js:GET /users] Route handler executed');
  console.log('👤 [routes/admin.js] User from auth:', req.user ? req.user.id : 'No user');
  console.log('📦 [routes/admin.js] Query params:', req.query);
  
  try {
    // Your logic here
    console.log('✅ [routes/admin.js] Sending response');
    res.status(200).json({ 
      success: true, 
      users: [] // your actual users data
    });
  } catch (error) {
    console.error('❌ [routes/admin.js] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Promote user to admin





// Debug route to list all routes
router.get("/debug-routes", (req, res) => {
  const routes = [];
  router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      routes.push({
        path: layer.route.path,
        methods: methods
      });
    }
  });
  res.json({ routes });
});

console.log("📋 Admin routes registered:");
router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} ${layer.route.path}`);
  }
});

console.log("✅ admin.js is loaded!");

// Log all routes in this file
console.log('📌 [routes/admin.js] Registered routes:');
router.stack.forEach((r) => {
  if (r.route) {
    console.log(`   ${Object.keys(r.route.methods).join(', ').toUpperCase()} /admin${r.route.path}`);
  }
});

module.exports = router;
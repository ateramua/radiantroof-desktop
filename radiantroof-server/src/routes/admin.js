const express = require("express");
const router = express.Router();
const { Pool } = require('pg');

// Create a reusable database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('📋 [routes/admin.js] Loading admin routes...');

// --------------------
// Middleware to protect admin routes
// --------------------
function requireAdmin(req, res, next) {
  // Example: req.user is set by your auth middleware
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ message: "Unauthorized: Admins only" });
  }
  next();
}

// --------------------
// Test route
// --------------------
router.get("/test", (req, res) => {
  res.json({ message: "Admin router is working!" });
});

// --------------------
// Get all users (admin only)
// --------------------
router.get("/users", requireAdmin, async (req, res) => {
  console.log('👮‍♂️ [admin.js] GET /users executed');
  try {
    const result = await pool.query('SELECT id, email, is_admin FROM "Users"');
    res.status(200).json({ success: true, users: result.rows });
  } catch (err) {
    console.error('❌ [admin.js] DB error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Debug routes
// --------------------
router.get("/debug-all-routes", (req, res) => {
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      const path = layer.route.path;
      routes.push({ methods, path: `/admin${path}` });
    }
  });
  res.json({ message: "All registered admin routes", routes, total: routes.length });
});

router.get("/debug-routes", (req, res) => {
  const routes = [];
  router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      routes.push({ path: layer.route.path, methods });
    }
  });
  res.json({ routes });
});

// --------------------
// Log routes on server start
// --------------------
console.log("📋 Admin routes registered:");
router.stack.forEach(layer => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`   ${methods} /admin${layer.route.path}`);
  }
});

console.log("✅ admin.js is loaded!");
module.exports = router;
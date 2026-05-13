const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

const db = require('./src/models');

const app = express();

// CORS configuration - Updated for production and local testing
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://uncomplementally-issueless-veronique.ngrok-free.dev',
      'https://www.radiantroofrealty.com',
      'app://-'
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: origin not allowed')); 
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'ngrok-skip-browser-warning'] // THIS MUST BE THERE
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Make db available to routes (optional - can also import directly in routes)
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ============================================
// HEALTH CHECK ENDPOINT (important for Render)
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    database: 'connected'
  });
});

// ============================================
// TEST DATABASE ENDPOINT
// ============================================
app.get('/api/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      success: true, 
      message: 'Database connected'
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed' 
    });
  }
});

// ============================================
// IMPORT ROUTES
// ============================================
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/admin');
const propertyRoutes = require('./src/routes/propertyRoutes');
const countyRoutes = require('./src/routes/countyRoutes');

// ============================================
// MOUNT ROUTES
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/county", countyRoutes);

// Simple test route
app.get("/test", (req, res) => {
    res.send("Server is running!");
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Test database connection on startup
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌎 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️  Test DB: http://localhost:${PORT}/api/test-db`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Continuing with server startup. Database operations may fail.');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} (database not ready)`);
      console.log(`🌎 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  });

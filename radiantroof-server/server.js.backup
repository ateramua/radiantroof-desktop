const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
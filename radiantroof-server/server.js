// /server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
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


// Safe logger for all POST requests
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log('📦 [POST Request] URL:', req.originalUrl);
    console.log('📥 Body:', req.body || {});
  }
  next();
});

// Mount routes safely
try {
    const authRoutes = require('./src/routes/authRoutes');
    const userRoutes = require('./src/routes/userRoutes');
    const adminRoutes = require('./src/routes/admin');
    const propertyRoutes = require('./src/routes/propertyRoutes'); // ✅ Add properties

        // DEBUG: Check what we got
    console.log('✅ authRoutes type:', typeof authRoutes);
    console.log('✅ userRoutes type:', typeof userRoutes);
    console.log('✅ adminRoutes type:', typeof adminRoutes);
    console.log('✅ propertyRoutes type:', typeof propertyRoutes);
    

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/admin", adminRoutes);
    app.use("/api/properties", propertyRoutes); // ✅ Mount properties
    

} catch (err) {
    console.error('❌ Error loading routes:', err);
}

// Simple test route
app.get("/test", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});



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

// Mount routes safely
try {
    const userRoutes = require('./src/routes/userRoutes');
    const adminRoutes = require('./src/routes/admin');
    const propertyRoutes = require('./src/routes/propertyRoutes'); // ✅ Add properties

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
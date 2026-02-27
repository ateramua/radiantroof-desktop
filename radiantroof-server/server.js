// /server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
// const sequelize = require('./src/config/database'); // Your SQL connection

// Your existing imports

const adminRoutes = require('./src/routes/admin');
// ... other imports

dotenv.config();

console.log('🚀 [server.js] Server starting...');
console.log('📁 [server.js] Current directory:', process.cwd());
console.log('🔧 [server.js] NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Routes - Mount these BEFORE printing routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use('/admin', adminRoutes);

// Print all registered routes AFTER they're mounted
console.log('\n📋 ALL REGISTERED ROUTES:');

function printRoutes(stack, basePath = '') {
    if (!stack) {
        console.log('   No routes registered yet');
        return;
    }
    
    stack.forEach((layer) => {
        if (layer.route) {
            // Direct route
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            const path = basePath + layer.route.path;
            console.log(`   ${methods} ${path}`);
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
            // Router middleware
            let routerPath = '';
            if (layer.regexp) {
                routerPath = layer.regexp.source
                    .replace('\\/?(?=\\/|$)', '')
                    .replace(/\\\//g, '/')
                    .replace(/\^/g, '')
                    .replace(/\?/g, '');
            }
            printRoutes(layer.handle.stack, basePath + routerPath);
        }
    });
}


// Test database connection (commented out for now)
// sequelize.authenticate()
//     .then(() => console.log('✅ SQL Database connected'))
//     .catch(err => console.error('❌ SQL Database connection error:', err));

const PORT = process.env.PORT || 5001; // Using 5001 as per your working setup
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    // Small delay to ensure routes are fully registered
setTimeout(() => {
    if (app._router && app._router.stack) {
        printRoutes(app._router.stack);
        console.log('========================\n');
    } else {
        console.log('❌ Could not print routes - router not available');
    }
}, 100);

});
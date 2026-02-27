const express = require('express');
const path = require('path');

console.log('🔍 TESTING ROUTE IMPORTS');
console.log('Current directory:', __dirname);
console.log('---');

// Test importing authRoutes
try {
    console.log('📁 Attempting to import authRoutes...');
    const authRoutesPath = './src/routes/authRoutes';
    console.log('Path:', authRoutesPath);
    
    const authRoutes = require(authRoutesPath);
    
    console.log('✅ authRoutes imported successfully');
    console.log('📦 Type:', typeof authRoutes);
    console.log('📦 Is Express router?', !!(authRoutes && authRoutes.stack));
    
    if (authRoutes && authRoutes.stack) {
        console.log('📋 Registered auth routes:');
        authRoutes.stack.forEach((layer, index) => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
                console.log(`   ${index}: ${methods} ${layer.route.path}`);
            } else if (layer.name === 'router' && layer.handle.stack) {
                console.log(`   ${index}: Nested router`);
            } else {
                console.log(`   ${index}: Middleware (${layer.name || 'anonymous'})`);
            }
        });
    } else {
        console.log('❌ authRoutes is not a valid Express router');
        console.log('Value:', authRoutes);
    }
} catch (err) {
    console.error('❌ Failed to import authRoutes:');
    console.error('   Error:', err.message);
    console.error('   Stack:', err.stack);
}

console.log('\n---');

// Test importing userRoutes
try {
    console.log('📁 Attempting to import userRoutes...');
    const userRoutesPath = './src/routes/userRoutes';
    console.log('Path:', userRoutesPath);
    
    const userRoutes = require(userRoutesPath);
    
    console.log('✅ userRoutes imported successfully');
    console.log('📦 Type:', typeof userRoutes);
    console.log('📦 Is Express router?', !!(userRoutes && userRoutes.stack));
    
    if (userRoutes && userRoutes.stack) {
        console.log('📋 Registered user routes:');
        userRoutes.stack.forEach((layer, index) => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
                console.log(`   ${index}: ${methods} ${layer.route.path}`);
            } else if (layer.name === 'router' && layer.handle.stack) {
                console.log(`   ${index}: Nested router`);
            } else {
                console.log(`   ${index}: Middleware (${layer.name || 'anonymous'})`);
            }
        });
    } else {
        console.log('❌ userRoutes is not a valid Express router');
        console.log('Value:', userRoutes);
    }
} catch (err) {
    console.error('❌ Failed to import userRoutes:');
    console.error('   Error:', err.message);
    console.error('   Stack:', err.stack);
}

console.log('\n---');

// Test importing adminRoutes
try {
    console.log('📁 Attempting to import adminRoutes...');
    const adminRoutesPath = './src/routes/admin';
    console.log('Path:', adminRoutesPath);
    
    const adminRoutes = require(adminRoutesPath);
    
    console.log('✅ adminRoutes imported successfully');
    console.log('📦 Type:', typeof adminRoutes);
    console.log('📦 Is Express router?', !!(adminRoutes && adminRoutes.stack));
} catch (err) {
    console.error('❌ Failed to import adminRoutes:');
    console.error('   Error:', err.message);
}

console.log('\n---');

// Test importing propertyRoutes
try {
    console.log('📁 Attempting to import propertyRoutes...');
    const propertyRoutesPath = './src/routes/propertyRoutes';
    console.log('Path:', propertyRoutesPath);
    
    const propertyRoutes = require(propertyRoutesPath);
    
    console.log('✅ propertyRoutes imported successfully');
    console.log('📦 Type:', typeof propertyRoutes);
    console.log('📦 Is Express router?', !!(propertyRoutes && propertyRoutes.stack));
} catch (err) {
    console.error('❌ Failed to import propertyRoutes:');
    console.error('   Error:', err.message);
}

console.log('\n✅ Test complete');
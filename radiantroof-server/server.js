// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const houseRoutes = require('./src/routes/houseRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/houses', houseRoutes);
app.use('/api/users', userRoutes);

// Simple ping route for health check
app.get('/ping', (req, res) => res.json({ success: true, message: 'pong' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const propertyRoutes = require("./src/routes/propertyRoutes"); // server.js is outside src
const userRoutes = require("./src/routes/userRoutes");
const db = require("./src/models");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected and synchronized");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect to database:", err);
  });
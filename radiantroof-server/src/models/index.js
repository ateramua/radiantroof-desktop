const { Sequelize, DataTypes } = require("sequelize");

// Use environment variables directly, with fallbacks
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "radiantroof_db",
  username: process.env.DB_USER || "radiant_user",
  password: process.env.DB_PASSWORD || "supersecurepassword",
  logging: console.log, // Enable logging to see SQL queries
  dialectOptions: process.env.NODE_ENV === "production" 
    ? { ssl: { require: true, rejectUnauthorized: false } } 
    : {} // No SSL for local dev
});

// Test the connection immediately
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Initialize models
const Property = require("./Property")(sequelize, DataTypes);

// Fix User table mapping for case sensitivity
const User = require("./User")(sequelize, DataTypes, {
  tableName: "Users" // match exact table name in PostgreSQL
});

const db = {
  sequelize,
  Sequelize,
  Property,
  User,
};

module.exports = db;
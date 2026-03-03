const { Sequelize, DataTypes } = require("sequelize");

// Use environment variables directly, with fallbacks for safety
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: console.log, // Temporarily enable logging to see queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
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
const User = require("./User")(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  Property,
  User,
};

module.exports = db;
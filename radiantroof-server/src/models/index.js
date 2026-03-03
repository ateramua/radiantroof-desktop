const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Initialize models AFTER sequelize is defined
const Property = require("./Property")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);

// Export an object containing Sequelize instance and models
const db = {
  sequelize,
  Sequelize,
  Property,
  User,
};

module.exports = db;
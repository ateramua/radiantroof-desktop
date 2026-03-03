const { DataTypes } = require("sequelize");
const db = require("./index");

const Property = db.sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bedrooms: {
    type: DataTypes.INTEGER
  },
  bathrooms: {
    type: DataTypes.FLOAT
  },
  sqft: {
    type: DataTypes.INTEGER
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Properties',   // CRITICAL - matches your database
  timestamps: true
});

module.exports = Property;

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CountySource = sequelize.define("CountySource", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    countyId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastFetch: {
      type: DataTypes.DATE
    },
    fetchFrequency: {
      type: DataTypes.INTEGER, // in hours
      defaultValue: 24
    },
    config: {
      type: DataTypes.JSON, // Store county-specific config
      defaultValue: {}
    }
  });

  return CountySource;
};
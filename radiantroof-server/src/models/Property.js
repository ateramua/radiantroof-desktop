const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Property = sequelize.define("Property", {
    address: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    country: { 
      type: DataTypes.STRING, 
      allowNull: false,
      defaultValue: "USA" 
    },
    description: { 
      type: DataTypes.TEXT 
    },
    price: { 
      type: DataTypes.FLOAT, 
      allowNull: false 
    },
    photo: { 
      type: DataTypes.STRING // URL or file reference
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Available"
    },
    // Workflow-specific fields as JSON
    screening: { 
      type: DataTypes.JSON, 
      defaultValue: {} 
    },
    analysis: { 
      type: DataTypes.JSON, 
      defaultValue: {} 
    },
    decision: { 
      type: DataTypes.JSON, 
      defaultValue: {} 
    },
    acquisition: { 
      type: DataTypes.JSON, 
      defaultValue: {} 
    },
  });

  return Property;
};
const { DataTypes } = require("sequelize");
const db = require("./index");

const Property = db.sequelize.define('Property', {
  // ========== BASIC PROPERTY INFO ==========
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  zip: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "USA"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ========== PROPERTY STATUS ==========
  status: {
    type: DataTypes.STRING,
    defaultValue: "Available"
  },

  // ========== WORKFLOW STAGE ==========
  workflowStage: {
    type: DataTypes.STRING,
    defaultValue: "source",
    allowNull: false
  },

  // ========== SOURCE INFORMATION ==========
  sourceType: {
    type: DataTypes.STRING,
    defaultValue: 'manual',
    allowNull: false
  },
  sourceId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sourceDetail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sourceContact: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ========== COUNTY RECORDS SPECIFIC ==========
  countySource: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parcelId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ========== FINANCIALS FROM COUNTY ==========
  assessedValue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  marketValue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastSalePrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lastSaleDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // ========== TAX INFORMATION ==========
  taxDelinquent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  taxAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  taxYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // ========== PROPERTY CHARACTERISTICS ==========
  yearBuilt: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sqft: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bathrooms: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lotSize: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  // ========== DEAL METRICS (CALCULATED) ==========
  askingPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  estimatedArv: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  estimatedRepairs: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxOffer: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  estimatedProfit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  estimatedRoi: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  dealScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'cold'
  },

  // ========== WORKFLOW-SPECIFIC FIELDS (AS JSON) ==========
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
  renovation: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  exit: {
    type: DataTypes.JSON,
    defaultValue: {}
  },

  // ========== TIMELINE ==========
  lastContacted: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextFollowUp: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // ========== TAGS & NOTES ==========
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Properties',
  timestamps: true
});

module.exports = Property;
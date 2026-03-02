const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Property = sequelize.define("Property", {
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
      type: DataTypes.STRING, // URL or file reference
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
      defaultValue: "source", // source, screening, analysis, acquire, renovate, exit
      allowNull: false
    },
    
    // ========== SOURCE INFORMATION ==========
    sourceType: {
      type: DataTypes.STRING,
      defaultValue: 'manual', // manual, csv, wholesaler, expired_mls, county
      allowNull: false
    },
    sourceId: {
      type: DataTypes.STRING,
      allowNull: true // County ID + parcel ID or MLS number
    },
    sourceDetail: {
      type: DataTypes.STRING,
      allowNull: true // Additional source info
    },
    sourceContact: {
      type: DataTypes.STRING,
      allowNull: true // Agent/wholesaler name or contact
    },
    
    // ========== COUNTY RECORDS SPECIFIC ==========
    countySource: {
      type: DataTypes.STRING,
      allowNull: true // Which county it came from (travis-tx, dallas-tx, etc.)
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
      type: DataTypes.FLOAT, // in acres
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
      type: DataTypes.STRING, // hot, warm, cold
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
  });

  return Property;
};
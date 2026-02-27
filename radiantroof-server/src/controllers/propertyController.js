const db = require("../models");
const Property = db.Property;

// Get all properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { screening, analysis, decision, acquisition, ...otherFields } = req.body;

  try {
    const property = await Property.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Update nested acquisition workflow safely
    const updatedAcquisition = { ...property.acquisition };
    if (screening) updatedAcquisition.screening = screening;
    if (analysis) updatedAcquisition.analysis = analysis;
    if (decision) updatedAcquisition.decision = decision;
    if (acquisition) updatedAcquisition.acquisition = acquisition;

    await property.update({
      ...otherFields,
      acquisition: updatedAcquisition,
    });

    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    await property.destroy();
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get acquisition offers
const getPropertyOffers = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property.acquisition?.offers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new offer
const addPropertyOffer = async (req, res) => {
  const { id } = req.params;
  const { offer } = req.body;

  try {
    const property = await Property.findByPk(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    const acquisition = property.acquisition || {};
    acquisition.offers = acquisition.offers || [];

    const newOffer = {
      ...offer,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    acquisition.offers.push(newOffer);

    await property.update({ acquisition });

    res.json(acquisition.offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyOffers,
  addPropertyOffer,
};
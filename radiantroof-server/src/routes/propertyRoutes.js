const express = require("express");
const express = require("express");
const router = express.Router();
const { getProperties } = require("../controllers/propertyControllers");




const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyOffers,
  addPropertyOffer,
} = require("../controllers/propertyController");

// Property CRUD
router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

// Offers
router.get("/:id/offers", getPropertyOffers);
router.post("/:id/offers", addPropertyOffer);

module.exports = router;
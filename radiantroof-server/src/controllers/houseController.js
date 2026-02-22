// src/controllers/houseController.js
const House = require('../models/House');

const getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll();  // This queries all rows in the `houses` table
    // console.log(houses);  // Log houses to the console
    res.json(houses);  // Send the houses as JSON response to the client
  } catch (err) {
    console.error(err);  // Log error to the console if something goes wrong
    res.status(500).json({ error: err.message });
  }
};

const getHouseById = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.houseId); // Fetch specific house by ID
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json(house); // Send house data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllHouses, getHouseById };
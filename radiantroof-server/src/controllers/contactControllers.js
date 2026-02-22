const House = require('../models/House');

const getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHouseById = async (req, res) => {
  try {
    const house = await House.findByPk(req.params.houseId);
    if (!house) return res.status(404).json({ error: 'House not found' });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllHouses, getHouseById };
const express = require('express');
const router = express.Router();
const { getAllHouses, getHouseById } = require('../controllers/houseController');

router.get('/', getAllHouses);
router.get('/:houseId', getHouseById);

module.exports = router;
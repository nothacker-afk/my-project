const express = require('express');
const router = express.Router();
const { getAllHotels, getHotel, createHotel, updateHotel, deleteHotel } = require('../controllers/hotelController');

router.get('/', getAllHotels);
router.get('/:id', getHotel);
router.post('/', createHotel);
router.put('/:id', updateHotel);
router.delete('/:id', deleteHotel);

module.exports = router;

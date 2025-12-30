const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  availableRooms: {
    type: Number,
    default: 50,
  },
  amenities: [String],
  description: String,
  image: String,
  roomTypes: [{
    type: String,
    name: String,
    price: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);

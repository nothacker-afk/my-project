const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  airline: {
    type: String,
    required: true,
  },
  departureCity: {
    type: String,
    required: true,
  },
  departureAirport: String,
  arrivalCity: {
    type: String,
    required: true,
  },
  arrivalAirport: String,
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  duration: String, // e.g., "2h 30m"
  price: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    default: 150,
  },
  aircraft: String,
  stops: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flight', flightSchema);

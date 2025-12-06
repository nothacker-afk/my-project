const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'package'],
    required: true,
  },
  flightIds: [mongoose.Schema.Types.ObjectId],
  hotelId: mongoose.Schema.Types.ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  numberOfRooms: Number,
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
  },
  passengerDetails: [
    {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      email: String,
    },
  ],
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);

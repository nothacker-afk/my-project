const Booking = require('../models/Booking');

// Create booking reference
const generateBookingReference = () => {
  return 'BK' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { bookingType, flightIds, hotelId, checkInDate, checkOutDate, numberOfGuests, numberOfRooms, totalPrice, passengerDetails } = req.body;

    const booking = await Booking.create({
      bookingReference: generateBookingReference(),
      userId: req.user.id,
      bookingType,
      flightIds,
      hotelId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      totalPrice,
      passengerDetails,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('flightIds')
      .populate('hotelId');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flightIds')
      .populate('hotelId');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Flight = require('../models/Flight');

// Get all flights
exports.getAllFlights = async (req, res) => {
  try {
    const { departureCity, arrivalCity, departureDate } = req.query;
    let query = {};

    if (departureCity) {
      query.departureCity = new RegExp(departureCity, 'i');
    }
    if (arrivalCity) {
      query.arrivalCity = new RegExp(arrivalCity, 'i');
    }
    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.departureTime = {
        $gte: date,
        $lt: nextDay,
      };
    }

    const flights = await Flight.find(query).sort({ price: 1 });
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single flight
exports.getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create flight (admin only)
exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update flight
exports.updateFlight = async (req, res) => {
  try {
    let flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete flight
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

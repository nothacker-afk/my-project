import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flight, hotel } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState([
    { firstName: '', lastName: '', dateOfBirth: '', email: '' }
  ]);

  const handlePassengerChange = (index, field, value) => {
    const newDetails = [...passengerDetails];
    newDetails[index][field] = value;
    setPassengerDetails(newDetails);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        bookingType: flight ? 'flight' : 'hotel',
        flightIds: flight ? [flight._id] : [],
        hotelId: hotel ? hotel._id : undefined,
        numberOfGuests: 1,
        totalPrice: flight ? flight.price : hotel.pricePerNight,
        passengerDetails,
        paymentMethod: 'credit_card',
      };

      const response = await bookingAPI.createBooking(bookingData);
      alert(`Booking confirmed! Reference: ${response.data.data.bookingReference}`);
      navigate('/bookings');
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!flight && !hotel) {
    return (
      <div className="checkout-container">
        <p>No booking selected. <a href="/">Go back to search</a></p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          {flight && (
            <div className="summary-item">
              <span>{flight.departureCity} → {flight.arrivalCity}</span>
              <span className="price">${flight.price}</span>
            </div>
          )}
          {hotel && (
            <div className="summary-item">
              <span>{hotel.name} - {hotel.city}</span>
              <span className="price">${hotel.pricePerNight}/night</span>
            </div>
          )}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong className="total-price">
              ${flight ? flight.price : hotel.pricePerNight}
            </strong>
          </div>
        </div>

        <div className="passenger-form">
          <h2>Passenger Details</h2>
          {passengerDetails.map((passenger, index) => (
            <div key={index} className="passenger-input">
              <h3>Passenger {index + 1}</h3>
              <input
                type="text"
                placeholder="First Name"
                value={passenger.firstName}
                onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={passenger.lastName}
                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={passenger.email}
                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="checkout-btn"
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

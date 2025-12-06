import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="bookings-container"><p>Loading...</p></div>;

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet. <a href="/">Start booking now!</a></p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <span className="booking-ref">Booking #{booking.bookingReference}</span>
                <span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span>
              </div>
              <div className="booking-details">
                <p><strong>Type:</strong> {booking.bookingType}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Number of Guests:</strong> {booking.numberOfGuests}</p>
                <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="booking-actions">
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="cancel-btn"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;

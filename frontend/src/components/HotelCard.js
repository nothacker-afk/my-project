import React from 'react';
import './HotelCard.css';

const HotelCard = ({ hotel, onSelect }) => {
  return (
    <div className="hotel-card">
      <div className="hotel-image">
        {hotel.image ? (
          <img src={hotel.image} alt={hotel.name} />
        ) : (
          <div className="placeholder">🏨</div>
        )}
      </div>
      <div className="hotel-content">
        <h3>{hotel.name}</h3>
        <p className="hotel-location">📍 {hotel.city}</p>
        <div className="hotel-rating">
          <span className="stars">{'⭐'.repeat(Math.round(hotel.rating))}</span>
          <span className="rating-text">{hotel.rating} ({hotel.reviews} reviews)</span>
        </div>
        <div className="hotel-amenities">
          {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity">{amenity}</span>
          ))}
        </div>
      </div>
      <div className="hotel-price">
        <span className="price">${hotel.pricePerNight}/night</span>
        <button className="select-btn" onClick={() => onSelect(hotel)}>Book Now</button>
      </div>
    </div>
  );
};

export default HotelCard;

import React, { useState } from 'react';
import './FlightCard.css';

const FlightCard = ({ flight, onSelect }) => {
  const departureTime = new Date(flight.departureTime);
  const arrivalTime = new Date(flight.arrivalTime);

  return (
    <div className="flight-card">
      <div className="flight-info">
        <div className="flight-route">
          <div className="flight-city">
            <span className="time">{departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="city">{flight.departureCity}</span>
          </div>
          <div className="flight-duration">
            <span className="duration">{flight.duration}</span>
            <div className="flight-path">→</div>
          </div>
          <div className="flight-city">
            <span className="time">{arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="city">{flight.arrivalCity}</span>
          </div>
        </div>
        <div className="flight-details">
          <span>{flight.airline}</span>
          <span className="stops">{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop(s)`}</span>
        </div>
      </div>
      <div className="flight-price">
        <span className="price">${flight.price}</span>
        <button className="select-btn" onClick={() => onSelect(flight)}>Select</button>
      </div>
    </div>
  );
};

export default FlightCard;

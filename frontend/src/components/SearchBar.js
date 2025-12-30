import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('flight');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [city, setCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'flight') {
      onSearch({
        type: 'flight',
        departureCity: departure,
        arrivalCity: arrival,
        departureDate,
      });
    } else if (searchType === 'hotel') {
      onSearch({
        type: 'hotel',
        city,
        checkInDate,
        checkOutDate,
      });
    }
  };

  return (
    <div className="search-bar">
      <div className="search-tabs">
        <button
          className={`tab ${searchType === 'flight' ? 'active' : ''}`}
          onClick={() => setSearchType('flight')}
        >
          ✈️ Flights
        </button>
        <button
          className={`tab ${searchType === 'hotel' ? 'active' : ''}`}
          onClick={() => setSearchType('hotel')}
        >
          🏨 Hotels
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        {searchType === 'flight' ? (
          <>
            <input
              type="text"
              placeholder="Departure City"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Arrival City"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              required
            />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Check-in"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Check-out"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit" className="search-btn">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;

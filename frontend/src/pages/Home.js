import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FlightCard from '../components/FlightCard';
import HotelCard from '../components/HotelCard';
import { flightAPI, hotelAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setSearchType(searchParams.type);

    try {
      if (searchParams.type === 'flight') {
        const response = await flightAPI.searchFlights({
          departureCity: searchParams.departureCity,
          arrivalCity: searchParams.arrivalCity,
          departureDate: searchParams.departureDate,
        });
        setFlights(response.data.data);
      } else if (searchParams.type === 'hotel') {
        const response = await hotelAPI.searchHotels({
          city: searchParams.city,
          checkInDate: searchParams.checkInDate,
          checkOutDate: searchParams.checkOutDate,
        });
        setHotels(response.data.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    navigate('/booking/flight', { state: { flight } });
  };

  const handleSelectHotel = (hotel) => {
    navigate('/booking/hotel', { state: { hotel } });
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find and Book Your Perfect Trip</h1>
          <p>Search flights and hotels at the best prices</p>
        </div>
      </div>

      <div className="container">
        <SearchBar onSearch={handleSearch} />

        {loading && <div className="loading">Loading results...</div>}

        {searchType === 'flight' && !loading && (
          <div className="results-section">
            <h2>Available Flights ({flights.length})</h2>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <FlightCard
                  key={flight._id}
                  flight={flight}
                  onSelect={handleSelectFlight}
                />
              ))
            ) : (
              <p className="no-results">No flights found. Try a different search.</p>
            )}
          </div>
        )}

        {searchType === 'hotel' && !loading && (
          <div className="results-section">
            <h2>Available Hotels ({hotels.length})</h2>
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onSelect={handleSelectHotel}
                />
              ))
            ) : (
              <p className="no-results">No hotels found. Try a different search.</p>
            )}
          </div>
        )}

        {!searchType && (
          <div className="featured-section">
            <h2>Popular Destinations</h2>
            <div className="destinations-grid">
              <div className="destination-card">
                <div className="destination-emoji">🗽</div>
                <h3>New York</h3>
                <p>From $150</p>
              </div>
              <div className="destination-card">
                <div className="destination-emoji">🗼</div>
                <h3>Paris</h3>
                <p>From $200</p>
              </div>
              <div className="destination-card">
                <div className="destination-emoji">🗻</div>
                <h3>Tokyo</h3>
                <p>From $250</p>
              </div>
              <div className="destination-card">
                <div className="destination-emoji">🏖️</div>
                <h3>Bali</h3>
                <p>From $100</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth API
export const authAPI = {
  register: (userData) => axios.post(`${API_BASE_URL}/auth/register`, userData),
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  getCurrentUser: () => axios.get(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
};

// Flight API
export const flightAPI = {
  searchFlights: (params) => axios.get(`${API_BASE_URL}/flights`, { params }),
  getFlightDetails: (id) => axios.get(`${API_BASE_URL}/flights/${id}`),
};

// Hotel API
export const hotelAPI = {
  searchHotels: (params) => axios.get(`${API_BASE_URL}/hotels`, { params }),
  getHotelDetails: (id) => axios.get(`${API_BASE_URL}/hotels/${id}`),
};

// Booking API
export const bookingAPI = {
  createBooking: (bookingData) => axios.post(`${API_BASE_URL}/bookings`, bookingData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
  getUserBookings: () => axios.get(`${API_BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
  getBookingDetails: (id) => axios.get(`${API_BASE_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
  cancelBooking: (id) => axios.put(`${API_BASE_URL}/bookings/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
};

// User API
export const userAPI = {
  getUserProfile: (id) => axios.get(`${API_BASE_URL}/users/profile/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
  updateUserProfile: (id, userData) => axios.put(`${API_BASE_URL}/users/profile/${id}`, userData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
};

// Poll API
export const pollAPI = {
  list: () => axios.get(`${API_BASE_URL}/polls`),
  create: (data) => axios.post(`${API_BASE_URL}/polls`, data),
  get: (id) => axios.get(`${API_BASE_URL}/polls/${id}`),
  vote: (id, payload) => axios.post(`${API_BASE_URL}/polls/${id}/vote`, payload),
};

// Google auth helpers
export const googleAuth = {
  getUrl: () => axios.get(`${API_BASE_URL}/auth/google/url`),
};

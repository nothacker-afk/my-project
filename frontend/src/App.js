import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import Checkout from './pages/Checkout';
import Polls from './pages/Polls';
import PollCreate from './pages/PollCreate';
import PollDetail from './pages/PollDetail';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            />
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/create" element={<PollCreate />} />
            <Route path="/polls/:id" element={<PollDetail />} />
            <Route
              path="/booking/flight"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking/hotel"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        Hospital Food Management
      </div>

      {/* Navigation Links */}
      <nav className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link> {/* Link to Landing Page */}
        <Link to="#about" className="navbar-link">About</Link>
        <Link to="#contact" className="navbar-link">Contact</Link>
      </nav>

      {/* Login Dropdown */}
      <div className="login-dropdown">
        <button className="login-btn">Login</button>
        {/* Dropdown Menu */}
        <div className="dropdown-menu">
          <Link to="/admin-login" className="dropdown-item">
            Hospital Food Manager
          </Link>
          <Link to="/innerpantry-login" className="dropdown-item">
            Inner Pantry Staff
          </Link>
          <Link to="/delivery-portal" className="dropdown-item">
            Delivery Personnel
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

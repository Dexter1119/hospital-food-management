import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css'; // Import custom CSS file

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Contact Information */}
        <div className="footer-contact">
          <h3 className="footer-title">Contact Us</h3>
          <p>Email: <a href="mailto:hr@heliverse.com" className="footer-link">hr@heliverse.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="footer-link">+1 234 567 890</a></p>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="#" className="footer-social-icon" aria-label="Facebook">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="footer-social-icon" aria-label="Twitter">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="footer-social-icon" aria-label="LinkedIn">
            <FaLinkedinIn size={20} />
          </a>
          <a href="#" className="footer-social-icon" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-copyright">
        <p>© 2025 Hospital Food Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

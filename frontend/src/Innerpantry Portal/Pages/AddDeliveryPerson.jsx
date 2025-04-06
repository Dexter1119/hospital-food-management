import React, { useState } from 'react';
import apiClient from "../../utils/axiosConfig"; // Make sure axiosConfig is properly set up
import './styles/AddDeliveryPerson.css';  // Import the CSS file

const DeliveryPersonnelForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactInfo: '',
    additionalDetails: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Send the POST request to the backend
      const response = await apiClient.post('/api/delivery', formData);
      setSuccessMessage(response.data.message);
      setFormData({
        name: '',
        email: '',
        password: '',
        contactInfo: '',
        additionalDetails: '',
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-delivery-personnel">
      <h2>Add New Delivery Personnel</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Info:</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Additional Details:</label>
          <textarea
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Delivery Personnel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryPersonnelForm;

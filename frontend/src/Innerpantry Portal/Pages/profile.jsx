import React, { useState, useEffect } from 'react';
import apiClient from "../../utils/axiosConfig"; // Make sure axiosConfig is properly set up
import './styles/Profile.css';  // Import the CSS file

const PantryStaffDashboard = () => {
  const [pantryStaff, setPantryStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pantry staff details on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust according to where your token is stored

    if (token) {
      apiClient.get('/api/pantry-staff/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setPantryStaff(response.data.pantryStaff);
          setLoading(false);
        })
        .catch(err => {
          setError(err.response ? err.response.data.message : 'An error occurred');
          setLoading(false);
        });
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="dashboard-title">Profile</h1>
      <div className="profile-details">
        <p><b>Name:</b> {pantryStaff.name}</p>
        <p><b>Email:</b> {pantryStaff.email}</p>
        <p><b>Contact Info:</b> {pantryStaff.contactInfo}</p>
        <p><b>Role:</b> {pantryStaff.role}</p>
      </div>
    </div>
  );
};

export default PantryStaffDashboard;

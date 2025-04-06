import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig"; // Axios instance with baseURL
import "./styles/profile.css"; // Import the CSS file

const Profile = () => {
  const [profile, setProfile] = useState(null); // Profile data from the server
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false); // Track availability
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/api/delivery/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProfile(response.data.deliveryPersonnel);
        setIsAvailable(response.data.deliveryPersonnel.isAvailable); // Set the initial availability
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.patch(
        `/api/delivery/${profile._id}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(response.data.deliveryPersonnel);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Handle availability update
  const handleAvailabilityToggle = async () => {
    try {
      const response = await apiClient.patch(
        `/api/delivery/${profile._id}/availability`, // Use profile._id
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsAvailable(!isAvailable); // Toggle the availability status locally
      alert(response.data.message); // Display the success message from the response
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {profile && (
        <div className="profile-card">
          <div className="profile-row">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </div>
          <div className="profile-row">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>
          <div className="profile-row">
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="contactInfo.phone"
                value={profile.contactInfo || ""}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.contactInfo}</span>
            )}
          </div>

          <div className="profile-row">
            <label>Current Availability:</label>
            <span>{isAvailable ? "Available" : "Not Available"}</span>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="edit-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            )}

            {/* Add the button to update availability */}
            <button
              className="availability-btn"
              onClick={handleAvailabilityToggle}
            >
              {isAvailable ? "Set as Not Available" : "Set as Available"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

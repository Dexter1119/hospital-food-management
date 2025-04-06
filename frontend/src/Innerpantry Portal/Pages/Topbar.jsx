import React, { useState } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  return (
    <div className="topbar-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>
      <div className="topbar-right">
        <FaBell className="notification-icon" />
        <div className="user-profile">
          <FaUserCircle className="user-icon" />
          <div className="dropdown">
            <button className="dropdown-btn">Profile</button>
            <div className="dropdown-content">
              <a href="#">My Profile</a>
              <a href="#">Settings</a>
              <a href="#">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

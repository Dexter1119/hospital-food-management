import React, { useState, useEffect } from "react";
import '../styles/MealdeliveryTack.css'; // Import the CSS file

// Example data for meal delivery stats
const exampleData = {
  mealsDelivered: 250,
  pendingDeliveries: 20,
  delayedDeliveries: 5,
  totalPatients: 100,
};

const MealDeliveryOverview = () => {
  const [stats, setStats] = useState(exampleData);

  useEffect(() => {
    // Here you would fetch actual data from the backend API
    // For example:
    // fetch('/api/meal-stats')
    //   .then((response) => response.json())
    //   .then((data) => setStats(data));
  }, []);

  return (
    <div className="overview-container">
      <h3 className="header">Meal Delivery Overview</h3>
      <div className="grid">
        {/* Meals Delivered Card */}
        <div className="grid-item">
          <h4>Meals Delivered</h4>
          <p>{stats.mealsDelivered}</p>
        </div>

        {/* Pending Deliveries Card */}
        <div className="grid-item">
          <h4>Pending Deliveries</h4>
          <p>{stats.pendingDeliveries}</p>
        </div>

        {/* Delayed Deliveries Card */}
        <div className="grid-item">
          <h4>Delayed Deliveries</h4>
          <p>{stats.delayedDeliveries}</p>
        </div>

        {/* Total Patients Card */}
        <div className="grid-item">
          <h4>Total Patients</h4>
          <p>{stats.totalPatients}</p>
        </div>
      </div>
    </div>
  );
};

export default MealDeliveryOverview;

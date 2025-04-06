import React, { useState } from 'react';
import apiClient from "../../utils/axiosConfig";
import '../styles/PantryTaskManagement.css'; // External CSS import for better structure

const PantryTaskManagement = () => {
  const [mealType, setMealType] = useState('');
  const [mealStatusList, setMealStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch meal status based on mealType
  const fetchMealStatus = async (mealType) => {
    setLoading(true);
    setError('');
    setMealStatusList([]);
    try {
      const response = await apiClient.get(`/api/meal/status/${mealType}`);
      setMealStatusList(response.data.mealStatusList);
    } catch (err) {
      setError('Error fetching meal status.');
    } finally {
      setLoading(false);
    }
  };

  // Handle button clicks for different meal types
  const handleMealTypeClick = (meal) => {
    setMealType(meal);
    fetchMealStatus(meal);
  };

  return (
    <div className="meal-status-tracker">
      <h1 className="title">Meal Status Tracker</h1>

      <div className="meal-type-selection">
        <button onClick={() => handleMealTypeClick('Morning')} className="meal-type-button">Morning</button>
        <button onClick={() => handleMealTypeClick('Evening')} className="meal-type-button">Evening</button>
        <button onClick={() => handleMealTypeClick('Night')} className="meal-type-button">Night</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="error">{error}</p>}

      {mealStatusList.length > 0 ? (
        <div className="meal-status-table">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Room</th>
                <th>Preparation Status</th>
                <th>Prepared By</th>
                <th>Meal Name</th>
                <th>Delivery Status</th>
                <th>Delivered By</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {mealStatusList.map((status, index) => (
                <tr key={index}>
                  <td>{status.patientName}</td>
                  <td>{status.patientRoom}</td>
                  <td>{status.preparationStatus}</td>
                  <td>{status.preparationStaff}</td>
                  <td>{status.dietChartName}</td>
                  <td>{status.deliveryStatus}</td>
                  <td>{status.deliveryPersonnel}</td>
                  <td>{status.deliveryPersonnelContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No task is assigned yet for the selected meal type.</p>
      )}
    </div>
  );
};

export default PantryTaskManagement;

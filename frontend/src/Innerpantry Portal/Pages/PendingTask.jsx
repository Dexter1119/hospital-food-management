import React, { useState, useEffect } from 'react';
import apiClient from "../../utils/axiosConfig";
import './styles/PendingTask.css'; // Import the CSS file

const PendingTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMealDetails, setSelectedMealDetails] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get('/api/pantry-staff/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle status update
  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await apiClient.patch(
        `/api/pantry-staff/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Update the task list with the new status
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      alert('Error updating task status');
    }
  };

  // Fetch meal details when the "Meal Details" button is clicked
  const handleMealDetailsClick = async (dietChartId, mealTime) => {
    try {
      const response = await apiClient.get(`/api/diet-charts/dietCharts/${dietChartId}/${mealTime}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSelectedMealDetails(response.data);
    } catch (err) {
      alert('Error fetching meal details');
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pending-tasks-container">
      <h2 className="title">Assigned Tasks</h2>
      <div className="table-wrapper">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Meal Time</th>
              <th>Status</th>
              <th>Action</th>
              <th>Meal Details</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.patientId.name}</td>
                <td>{task.mealTime}</td>
                <td>{task.status}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button
                    className="meal-details-button"
                    onClick={() => handleMealDetailsClick(task.dietChartId._id, task.mealTime)}
                  >
                    Show Meal Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMealDetails && (
        <div className="meal-details">
          <h3>Meal Details</h3>
          <p><strong>Meal Time:</strong> {selectedMealDetails.timeOfDay}</p>
          <p><strong>Meal Plan:</strong> {selectedMealDetails.mealPlan.join(', ')}</p>
          <p><strong>Ingredients:</strong> {selectedMealDetails.ingredients.join(', ')}</p>
          <p><strong>Special Instructions:</strong> {selectedMealDetails.instructions}</p>
        </div>
      )}
    </div>
  );
};

export default PendingTask;

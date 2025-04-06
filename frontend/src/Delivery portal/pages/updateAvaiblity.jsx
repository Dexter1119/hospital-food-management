import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig"; // Axios instance with baseURL

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch completed tasks for the logged-in delivery personnel
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get("/api/delivery/compeleted/my-tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
          },
        });
        setTasks(response.data.tasks); // Set tasks to the state
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false); // Stop loading after fetching the data
      }
    };

    fetchTasks();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="tasks-container">
      <h2>Completed Tasks</h2>
      {tasks.length === 0 ? (
        <p>No completed tasks assigned to you at the moment.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Chart ID</th>
              <th>Meal Time</th>
              <th>Patient Name</th>
              <th>Room Number</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.mealBoxId ? task.mealBoxId.chartId : "N/A"}</td>
                <td>{task.patientInfo?.name}</td>
                <td>{task.patientInfo?.roomNumber}</td>
                <td>{task.mealTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompletedTasks;

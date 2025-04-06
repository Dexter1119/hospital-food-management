import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";
import './styles/pendingTask.css';  // Import the CSS file

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks assigned to the logged-in delivery personnel
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/api/delivery/my-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks); // Store tasks in the state
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Function to handle status update
  const updateTaskStatus = async (taskId, status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.patch(
        `/api/delivery/status/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Task status updated successfully");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Error updating task status");
    }
  };

  return (
    <div className="tasks-container">
      <h2>Assigned Tasks</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && tasks.length === 0 && <p>No tasks assigned.</p>}

      {!loading && !error && tasks.length > 0 && (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Meal Box ID</th>
                <th>Patient Name</th>
                <th>Room Number</th>
                <th>Meal Time</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.mealBoxId ? task.mealBoxId.chartId : "N/A"}</td>
                  <td>{task.patientInfo?.name}</td>
                  <td>{task.patientInfo?.roomNumber}</td>
                  <td>{task.mealTime}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyTasks;

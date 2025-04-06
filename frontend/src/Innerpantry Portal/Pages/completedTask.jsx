import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig"; // Axios instance with baseURL
import './styles/completedTask.css'; // Import the CSS file

const CompletedTasks = () => {
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    // Fetch completed tasks for the logged-in pantry staff
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiClient.get("/api/pantry-staff/completed/tasks", {
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
                <div className="tasks-table-wrapper">
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
                                    <td>{task.mealTime}</td>
                                    <td>{task.patientId.name}</td>
                                    <td>{task.patientId.roomNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedTasks;

import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";

const PatientDetailsPage = () => {
    const [patients, setPatients] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);

    useEffect(() => {
        apiClient
            .get("/api/patient")
            .then((response) => {
                setPatients(response.data.patients);
            })
            .catch((error) => {
                console.error("Error fetching patients:", error);
            });
    }, []);

    const handleDeletePatient = (id) => {
        apiClient
            .delete(`/api/patient/${id}`)
            .then(() => {
                setPatients(patients.filter((patient) => patient._id !== id));
            })
            .catch((error) => {
                console.error("Error deleting patient:", error);
            });
    };

    const handleEditPatient = (patient) => {
        setIsEditing(true);
        setCurrentPatient(patient);
    };

    const handleSaveChanges = () => {
        apiClient
            .put(`/api/patient/${currentPatient._id}`, currentPatient)
            .then((response) => {
                setPatients(
                    patients.map((patient) =>
                        patient._id === currentPatient._id ? response.data.patient : patient
                    )
                );
                setIsEditing(false);
                setCurrentPatient(null);
            })
            .catch((error) => {
                console.error("Error updating patient:", error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPatient({ ...currentPatient, [name]: value });
    };

    return (
        <div className="patient-details-container">
            <style>
                {`
                    .patient-details-container {
                        max-width: 1200px;
                        margin-left:400px;
                        padding: 20px;
                        background-color: #f4f7fc;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .page-title {
                        text-align: center;
                        font-size: 2rem;
                        margin-bottom: 20px;
                        color: #333;
                    }

                    .table-container {
                        overflow-x: auto;
                        margin-bottom: 30px;
                    }

                    .patient-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }

                    .patient-table th, .patient-table td {
                        padding: 12px 15px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }

                    .patient-table th {
                        background-color: #007bff;
                        color: #fff;
                    }

                    .patient-table td {
                        background-color: #fff;
                    }

                    .patient-table tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }

                    .patient-table tr:hover {
                        background-color: #f1f1f1;
                    }

                    .edit-btn, .delete-btn {
                        padding: 8px 16px;
                        margin: 5px;
                        cursor: pointer;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                    }

                    .edit-btn {
                        background-color: #ffc107;
                        color: #fff;
                    }

                    .delete-btn {
                        background-color: #dc3545;
                        color: #fff;
                    }

                    .edit-btn:hover, .delete-btn:hover {
                        opacity: 0.8;
                    }

                    .edit-modal {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        z-index: 1000;
                    }

                    .edit-modal h4 {
                        font-size: 1.5rem;
                        margin-bottom: 20px;
                    }

                    .edit-form {
                        display: flex;
                        flex-direction: column;
                    }

                    .form-group {
                        margin-bottom: 15px;
                    }

                    .form-group label {
                        margin-bottom: 5px;
                        font-size: 1rem;
                    }

                    .form-group input,
                    .form-group select {
                        width: 100%;
                        padding: 8px;
                        font-size: 1rem;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    .form-actions {
                        display: flex;
                        justify-content: space-between;
                    }

                    .save-btn, .cancel-btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        cursor: pointer;
                    }

                    .save-btn {
                        background-color: #28a745;
                        color: #fff;
                    }

                    .cancel-btn {
                        background-color: #6c757d;
                        color: #fff;
                    }

                    .save-btn:hover {
                        background-color: #218838;
                    }

                    .cancel-btn:hover {
                        background-color: #5a6268;
                    }

                    @media (max-width: 768px) {
                        .patient-details-container {
                            padding: 15px;
                        }

                        .patient-table {
                            font-size: 14px;
                        }

                        .patient-table th, .patient-table td {
                            padding: 8px 10px;
                        }

                        .edit-modal {
                            width: 90%;
                        }
                    }
                `}
            </style>

            <h3 className="page-title">Patient List</h3>
            <div className="table-container">
                <table className="patient-table">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Contact Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient._id}</td>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.contactInfo}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditPatient(patient)}>
                                        Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeletePatient(patient._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="edit-modal">
                    <h4>Edit Patient</h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveChanges();
                        }}
                        className="edit-form"
                    >
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={currentPatient.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={currentPatient.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender:</label>
                            <select
                                name="gender"
                                value={currentPatient.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Contact Info:</label>
                            <input
                                type="text"
                                name="contactInfo"
                                value={currentPatient.contactInfo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentPatient(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PatientDetailsPage;

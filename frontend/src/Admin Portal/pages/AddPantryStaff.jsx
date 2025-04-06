import React, { useState } from 'react';
import apiClient from "../../utils/axiosConfig"; // Make sure axiosConfig is properly set up
import '../styles/AddPantryStaff.css';  // Import the CSS file

const AddPantryStaff = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contactInfo: '',
        location: '',
        role: 'Preparation',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/api/pantry-staff', formData);
            alert('Pantry staff added successfully');
            setFormData({
                name: '',
                email: '',
                password: '',
                contactInfo: '',
                location: '',
                role: 'Preparation',
            });
        } catch (error) {
            console.error(error.response.data);
            alert('Error adding pantry staff');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-pantry-staff-form">
            <h2>Add Pantry Staff</h2>
            <div>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Contact Info</label>
                <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Preparation">Preparation</option>
                    <option value="Service">Service</option>
                    <option value="Manager">Manager</option>
                </select>
            </div>
            <button type="submit">Add Staff</button>
        </form>
    );
};

export default AddPantryStaff;

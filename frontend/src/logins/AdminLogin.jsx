import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';  // Import the updated CSS for styling

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook to handle navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message

        try {
            const response = await fetch('https://hospital-food-mangement-backend.onrender.com/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Store token locally
            navigate('/admin-dashboard'); // Redirect to Admin Portal
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="parent-container">
            <div className="login-container">
                <h2>Hospital Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;

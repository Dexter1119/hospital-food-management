import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const Logout = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook to programmatically navigate

    // Function to handle logout action (could be clearing user data, tokens, etc.)
    const handleLogout = () => {
        // Add any logout functionality here, e.g., clearing sessionStorage, localStorage, or state
        localStorage.removeItem('user'); // Example: remove user from localStorage
        sessionStorage.removeItem('authToken'); // Example: remove auth token from sessionStorage

        // Redirect to login page after logout
        navigate('/'); // Navigate to the login page
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h2 style={styles.heading}>You have been logged out</h2>
                <p style={styles.p}>Click below to log in again.</p>
                {/* Logout button triggers handleLogout function */}
                <button onClick={handleLogout} style={styles.btnLogout}>
                    Log In Again
                </button>
            </div>
        </div>
    );
};

const styles = {
    body: {
        margin: 0,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
    },
    container: {
        width: '80%',
        maxWidth: '600px',
        margin: '100px auto 100px 600px',

        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        textAlign: 'center',
    },
    heading: {
        color: '#00b8d4',
        marginBottom: '20px',
        fontSize: '24px',
    },
    p: {
        fontSize: '18px',
        color: '#555',
    },
    btnLogout: {
        display: 'inline-block',
        marginTop: "auto",
        padding: '12px 20px',
        backgroundColor: '#ff4c4c',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Logout;

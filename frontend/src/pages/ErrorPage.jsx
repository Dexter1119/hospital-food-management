import React from "react";
import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.errorContent}>
        <h1 style={styles.errorTitle}>Something Went Wrong!</h1>
        <p style={styles.errorMessage}>Sorry, we couldn't process your request. Please try again later.</p>
        <button style={styles.homeButton} onClick={() => window.location.href = "/"}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f2f2f2",
  },
  errorContent: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: "36px",
    color: "#FF6347",
    marginBottom: "20px",
  },
  errorMessage: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
  },
  homeButton: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ErrorPage;

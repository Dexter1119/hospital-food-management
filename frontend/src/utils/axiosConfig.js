import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
    baseURL: "https://hospital-food-mangement-backend.onrender.com", // Replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;

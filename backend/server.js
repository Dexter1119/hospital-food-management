const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


app.use(cors({
    origin: 'https://hospital-food-mangement-frontend.onrender.com',
    credentials: true
}));





// Connect to MongoDB using Mongoose
const mongoURL = "mongodb+srv://ankitasawant8998:q0YLIy6v5hyTL5CS@hospital-food-magement.23ulk.mongodb.net/?retryWrites=true&w=majority&appName=hospital-food-magement";

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Set view directory (if needed for rendering templates)
app.set("views", path.join(__dirname, "views"));

// Import Routes
const patientRoutes = require("./Routes/patientRoutes");
const dietChartRoutes = require("./Routes/DietChartRoutes");
const pantryStaffRoutes = require("./Routes/PantryStaffRoutes");
const deliveryRoutes = require("./Routes/deliveryRoutes");
const adminRoute = require("./Routes/adminRoute");
const mealRoute = require("./Routes/mealRoutes");

// Define API Routes
app.use("/api/patient", patientRoutes);
app.use("/api/diet-charts", dietChartRoutes);
app.use("/api/pantry-staff", pantryStaffRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/meal", mealRoute);

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

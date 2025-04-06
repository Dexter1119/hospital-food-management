// In the routes file (e.g., mealRoutes.js)
const express = require('express');
const router = express.Router();
const trackMealStatusByMealType = require('../utils/mealController');  // Assuming the function is in mealController.js

// Define the route to track meal status by mealType
router.get('/status/:mealType', trackMealStatusByMealType);

module.exports = router;

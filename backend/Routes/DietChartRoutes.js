const express = require('express');
const router = express.Router();
const DietChart = require('../models/DietChart');
const Patient = require('../models/Patient');
const wrapAsync = require("../utils/wrapAsyncs");
const ExpressError = require("../utils/ExpressError");
const assignTask = require("../utils/preprationTaskAssign");
const authMiddleware = require("../middleware/auth");

// Validation middleware for diet chart
const validateDietChart = async (req, res, next) => {
    const { patientId, meals, additionalNotes } = req.body;

    // Check if patientId is valid
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ExpressError(404, "Patient not found");
    }

    // Check if meals are provided and in the correct format
    if (!Array.isArray(meals) || meals.length === 0) {
        throw new ExpressError(400, "Meals are required and should be an array");
    }

    // Optionally, validate that meals contain timeOfDay, mealPlan, and ingredients
    meals.forEach(meal => {
        if (!meal.timeOfDay || !meal.mealPlan || !meal.ingredients) {
            throw new ExpressError(400, "Each meal must have timeOfDay, mealPlan, and ingredients");
        }
    });

    // Validate additionalNotes if provided (optional field)
    if (additionalNotes && typeof additionalNotes !== 'string') {
        throw new ExpressError(400, "Additional notes must be a string");
    }

    next();
};

// POST route to create a new diet chart
router.post(
    '/',
    validateDietChart,
    wrapAsync(async (req, res) => {
        const { patientId, meals, additionalNotes } = req.body;

        // Ensure no existing diet chart for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingDietChart = await DietChart.findOne({
            patientId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (existingDietChart) {
            throw new ExpressError(400, 'Diet chart for this patient already exists for today');
        }

        // Create a new diet chart
        const newDietChart = new DietChart({
            patientId,
            meals,
            additionalNotes,
            status: 'Active', // Default status is 'Active'
        });

        // Save the diet chart
        await newDietChart.save();

        // Assign preparation tasks for each meal in the diet chart
        const taskAssignments = await Promise.all(
            meals.map(async (meal) => {
                try {
                    return await assignTask({
                        patientId,
                        dietChartId: newDietChart._id,
                        mealTime: meal.timeOfDay,
                        notes: meal.instructions || 'No additional notes',
                    });
                } catch (error) {
                    console.error(`Failed to assign task for meal: ${meal.timeOfDay}`, error);
                    throw new ExpressError(500, `Failed to assign task for ${meal.timeOfDay}`);
                }
            })
        );

        // Respond with success message and assigned tasks
        res.status(201).json({
            message: 'Diet chart created and preparation tasks assigned successfully',
            dietChart: newDietChart,
            assignedTasks: taskAssignments.map(({ task, staff }) => ({
                task,
                assignedStaff: {
                    id: staff._id,
                    name: staff.name,
                    contactInfo: staff.contactInfo,
                },
            })),
        });
    })
);

// Get the information
router.get('/:patientId', wrapAsync(async (req, res, next) => {
    const { patientId } = req.params;

    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ExpressError(404, "Patient not found");
    }

    // Fetch diet charts for the patient
    const dietCharts = await DietChart.find({ patientId });

    // If no diet charts are found for the patient
    if (!dietCharts || dietCharts.length === 0) {
        return res.status(404).json({ message: "No diet charts found for this patient" });
    }

    // Respond with the patient's diet charts
    res.status(200).json({
        message: "Diet charts fetched successfully",
        dietCharts
    });
}));
// Route to fetch meal details based on diet chart ID and meal time (Morning, Afternoon, Evening, Night)
router.get('/dietCharts/:dietChartId/:mealTime', authMiddleware(['Preparation', 'Delivery']), wrapAsync(async (req, res) => {
    const { dietChartId, mealTime } = req.params;

    // Fetch the diet chart from the database
    const dietChart = await DietChart.findById(dietChartId);

    // If the diet chart doesn't exist
    if (!dietChart) {
        return res.status(404).json({ message: 'Meal details not found.' });
    }

    // Find the meal details that match the provided mealTime (Morning, Afternoon, Evening, Night)
    const mealDetails = dietChart.meals.find(meal => meal.timeOfDay === mealTime);

    // If no meal details are found for the specified mealTime
    if (!mealDetails) {
        return res.status(404).json({ message: `Meal details not found for ${mealTime}.` });
    }

    // Send the meal details for the specified meal time
    res.status(200).json(mealDetails);
}));



module.exports = router;

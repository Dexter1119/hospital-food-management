const express = require('express');
const router = express.Router();
const PreparationTask = require("../models/PreparationTask");  // Import Task model
const PantryStaff = require('../models/PantryStaff');  // Import PantryStaff model
const DietChart = require('../models/DietChart');  // Import DietChart model
const Patient = require('../models/Patient');  // Import Patient model
// const authMiddleware = require('../middleware/auth');  // JWT Authentication middleware
const ExpressError = require("./ExpressError");
const wrapAsync = require("./wrapAsyncs");

const assignTask = async ({ patientId, dietChartId, mealTime, notes }) => {
    // Validation: Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ExpressError(404, 'Patient not found');
    }

    // Validation: Check if diet chart exists
    const dietChart = await DietChart.findById(dietChartId);
    if (!dietChart) {
        throw new ExpressError(404, 'Diet chart not found');
    }

    // Validation: Check if mealTime is valid
    if (!mealTime || !['Morning', 'Evening', 'Night'].includes(mealTime)) {
        throw new ExpressError(400, 'Meal time must be one of "Morning", "Evening", or "Night"');
    }

    // Find pantry staff with the least number of tasks for the given meal time
    const pantryStaff = await PantryStaff.find();
    if (!pantryStaff || pantryStaff.length === 0) {
        throw new ExpressError(404, 'No pantry staff available');
    }

    // Calculate task counts for each staff member
    const taskCounts = await Promise.all(
        pantryStaff.map(async (staff) => {
            const count = await PreparationTask.countDocuments({
                assignedStaff: staff._id,
                mealTime,
                status: { $in: ['Pending', 'In Progress'] },
            });
            return { staff, count };
        })
    );

    // Sort by task count and pick the staff with the least tasks
    const leastBusyStaff = taskCounts.sort((a, b) => a.count - b.count)[0]?.staff;

    if (!leastBusyStaff) {
        throw new ExpressError(500, 'Unable to determine staff for task assignment');
    }

    // Check if a task for the same patient, diet chart, and meal time already exists
    const existingTask = await PreparationTask.findOne({
        patientId,
        dietChartId,
        mealTime,
        status: { $in: ['Pending', 'In Progress'] },
    });

    if (existingTask) {
        throw new ExpressError(400, 'A preparation task for this meal time is already in progress or pending.');
    }

    // Create a new preparation task
    const newTask = new PreparationTask({
        patientId,
        dietChartId,
        mealTime,
        assignedStaff: leastBusyStaff._id,
        notes,
        status: 'Pending', // Initial status is "Pending"
    });

    // Save the task to the database
    await newTask.save();

    return {
        task: newTask,
        staff: leastBusyStaff,
    };
};
module.exports = assignTask;

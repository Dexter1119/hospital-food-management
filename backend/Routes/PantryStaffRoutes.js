require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const PantryStaff = require('../models/PantryStaff');
const { pantryStaffValidationSchema } = require('../utils/joiSchema/pantryStaff');
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsyncs");
const authMiddleware = require("../middleware/auth");
const Task = require("../models/PreparationTask");
const assignDeliveryTask = require("../utils/deliverytaskAssign");


// Use environment variables for the JWT secret key (better security practice)
const JWT_SECRET = process.env.JWT_SECRET; // Use dotenv for better security

// Validation middleware for pantry staff creation
const validatePantryStaff = (req, res, next) => {
    const { error } = pantryStaffValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg); // Pass the validation error to the ExpressError handler
    } else {
        next(); // Proceed to the next middleware if validation passes
    }
};

// POST route for pantry staff login
router.post('/login', wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw new ExpressError(400, 'Email and password are required');
    }

    // Find pantry staff by email
    const pantryStaff = await PantryStaff.findOne({ email });

    // If staff not found, send error
    if (!pantryStaff) {
        throw new ExpressError(401, 'Invalid email or password');
    }

    // Compare provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, pantryStaff.password);

    if (!isPasswordCorrect) {
        throw new ExpressError(401, 'Invalid email or password');
    }

    // Generate JWT token (store id, email, and role in the token)
    const token = jwt.sign(
        { id: pantryStaff._id, email: pantryStaff.email, role: pantryStaff.role },
        JWT_SECRET, // Secret key to sign the token
        { expiresIn: '1h' } // Token expiration time
    );

    // Send response with token
    res.status(200).json({
        message: 'Login successful',
        token
    });
}));

// POST route to create a new pantry staff
router.post('/', validatePantryStaff, wrapAsync(async (req, res) => {
    const pantryStaffData = req.body;  // Get the pantry staff data from the request body

    // Create a new pantry staff record using the data from the request body
    const newPantryStaff = new PantryStaff(pantryStaffData);

    // Save the new pantry staff to the database
    await newPantryStaff.save();

    // Respond with success message and pantry staff data
    res.status(201).json({
        message: 'Pantry staff added successfully',
        pantryStaff: newPantryStaff // Return the newly created pantry staff object
    });
}));

// GET route to fetch all pantry staff
router.get('/', wrapAsync(async (req, res) => {
    // Retrieve all pantry staff from the database
    const pantryStaffList = await PantryStaff.find();

    // If no pantry staff are found, return an appropriate message
    if (pantryStaffList.length === 0) {
        return res.status(404).json({ message: 'No pantry staff found' });
    }

    // Send response with the list of pantry staff
    res.status(200).json({
        message: 'Pantry staff retrieved successfully',
        pantryStaff: pantryStaffList
    });
}));

// GET route to fetch the current logged-in pantry staff's details
router.get('/me', authMiddleware(['Preparation']), async (req, res) => {
    try {
        // The user ID is available in `req.user` due to the authMiddleware
        const pantryStaff = await PantryStaff.findById(req.user.id);

        if (!pantryStaff) {
            throw new ExpressError(404, 'Pantry staff not found');
        }

        // Return the staff details
        res.status(200).json({
            message: 'Pantry staff details fetched successfully',
            pantryStaff
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/tasks', authMiddleware(['Preparation']), wrapAsync(async (req, res) => {
    // Get the logged-in pantry staff's ID from the decoded token (JWT)
    const pantryStaffId = req.user.id;

    // Find tasks assigned to this pantry staff from the PreparationTask model
    const tasks = await Task.find({ assignedStaff: pantryStaffId, status: { $in: ['Pending', 'In Progress'] } })
        .populate('patientId', 'name roomNumber') // Populating patient details (like name and room number)
        .populate('dietChartId', 'mealDetails')  // Populating the meal details from the diet chart
        .populate('assignedStaff', 'name email role'); // Populating pantry staff info

    // If no tasks are found
    if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks found for this pantry staff.' });
    }

    // Send response with tasks data
    res.status(200).json({
        message: 'Tasks fetched successfully',
        tasks
    });
}));
router.get('/completed/tasks', authMiddleware(['Preparation']), wrapAsync(async (req, res) => {
    // Get the logged-in pantry staff's ID from the decoded token (JWT)
    const pantryStaffId = req.user.id;

    // Find tasks assigned to this pantry staff from the PreparationTask model
    const tasks = await Task.find({ assignedStaff: pantryStaffId, status: { $in: ['Completed'] } })
        .populate('patientId', 'name roomNumber') // Populating patient details (like name and room number)
        .populate('dietChartId', 'chartId')  // Populating the meal details from the diet chart
        .populate('assignedStaff', 'name email role'); // Populating pantry staff info

    // If no tasks are found
    if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks found for this pantry staff.' });
    }

    // Send response with tasks data
    res.status(200).json({
        message: 'Tasks fetched successfully',
        tasks
    });
}));

router.patch('/tasks/:taskId/status', authMiddleware(['Preparation']), wrapAsync(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
        throw new ExpressError(400, `Invalid status. Allowed values are: ${validStatuses.join(', ')}`);
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, assignedStaff: req.user.id },
        { status },
        { new: true }
    ).populate('patientId'); // Populate patient details

    if (!task) {
        throw new ExpressError(404, 'Task not found or you do not have permission to update this task.');
    }

    if (status === 'Completed') {
        try {
            const mealTime = task.mealTime;

            if (!mealTime) {
                throw new ExpressError(400, 'mealTime is required for assigning delivery task');
            }

            const patientInfo = {
                name: task.patientId.name,
                roomNumber: task.patientId.roomNumber,
            };

            if (!patientInfo.name || !patientInfo.roomNumber) {
                throw new ExpressError(400, 'Patient information is incomplete. Both name and room number are required.');
            }

            await assignDeliveryTask(task._id, patientInfo, mealTime);
        } catch (error) {
            throw new ExpressError(500, 'Error assigning delivery task: ' + error.message);
        }
    }

    res.status(200).json({
        message: 'Task status updated successfully',
        task
    });
}));




module.exports = router;

require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const DeliveryTask = require('../models/DeliveryTask');
const DeliveryPersonnel = require('../models/DeliveryPersonnel'); // Corrected model name
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsyncs');
const authMiddleware = require('../middleware/auth'); // JWT Authentication middleware
const { deliveryPersonnelValidationSchema } = require('../utils/joiSchema/deliveryPersonnel'); // Added import for validation schema

// Secret key for JWT token (use environment variables for better security)
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Middleware for validation
const validateDeliveryPersonnel = (req, res, next) => {
    const { error } = deliveryPersonnelValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    }
    next();
};

// POST route for delivery personnel login
router.post('/login', wrapAsync(async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Incoming Request Body:', req.body);

        if (!email || !password) {
            throw new ExpressError(400, 'Email and password are required');
        }

        const deliveryPersonnel = await DeliveryPersonnel.findOne({ email });
        if (!deliveryPersonnel) {
            throw new ExpressError(401, 'Invalid email or password');
        }

        const isPasswordCorrect = await bcrypt.compare(password, deliveryPersonnel.password);
        if (!isPasswordCorrect) {
            throw new ExpressError(401, 'Invalid email or password');
        }

        const token = jwt.sign(
            { id: deliveryPersonnel._id, email: deliveryPersonnel.email, role: 'Delivery' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}));
router.get('/me', authMiddleware(['Delivery']), wrapAsync(async (req, res) => {
    const deliveryPersonnelId = req.user.id; // Extract the user ID from the JWT token

    // Find the delivery personnel by ID
    const deliveryPersonnel = await DeliveryPersonnel.findById(deliveryPersonnelId).select('-password'); // Exclude the password field

    // If no delivery personnel is found
    if (!deliveryPersonnel) {
        return res.status(404).json({ message: 'Delivery personnel not found.' });
    }

    // Respond with the delivery personnel's profile
    res.status(200).json({
        message: 'Profile fetched successfully.',
        deliveryPersonnel,
    });
}));
// POST route to add a new delivery personnel
router.post('/', validateDeliveryPersonnel, wrapAsync(async (req, res) => {
    const { name, email, password, contactInfo, additionalDetails } = req.body;

    // Check if a delivery personnel with the same email already exists
    const existingPersonnel = await DeliveryPersonnel.findOne({ email });
    if (existingPersonnel) {
        throw new ExpressError(400, 'Delivery personnel with this email already exists');
    }

    // Create a new delivery personnel
    const newPersonnel = new DeliveryPersonnel({
        name,
        email,
        password,
        contactInfo,
        additionalDetails
    });

    // Save to the database
    await newPersonnel.save();

    // Respond with the created personnel's data (excluding the password)
    res.status(201).json({
        message: 'Delivery personnel added successfully',
    });
}));

// GET route to fetch tasks assigned to the logged-in delivery personnel
router.get('/my-tasks', authMiddleware(['Delivery']), wrapAsync(async (req, res) => {
    const deliveryPerson = req.user.id; // Extract the user ID from the JWT token

    // Find tasks assigned to the logged-in delivery personnel
    const tasks = await DeliveryTask.find({ deliveryPersonnelId: deliveryPerson, status: { $in: ['Pending', 'In Progress'] } }).populate('mealBoxId', 'chartId') // Only fetch specific fields
        .populate('deliveryPersonnelId', 'name')
        .populate('patientInfo', 'name roomNumber')
        .populate('preparationTaskId', 'details'); // Assuming the task model has `assignedTo` field

    // If no tasks found, return a message
    if (!tasks.length) {
        return res.status(200).json({
            message: 'No tasks assigned to you at the moment.',
            tasks: []
        });
    }

    // Respond with the tasks
    res.status(200).json({
        message: 'Assigned tasks retrieved successfully.',
        tasks
    });
}));
router.patch('/status/:taskId', authMiddleware(['Delivery']), async (req, res) => {
    const { taskId } = req.params; // Extract taskId from URL parameter
    const { status } = req.body;  // Extract the new status from the request body

    // Check if the provided status is valid
    const validStatuses = ['Pending', 'In Progress', 'Delivered'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status value. Status must be one of the following: Pending, In Progress, Delivered.'
        });
    }

    try {
        // Find the delivery task by ID
        const task = await DeliveryTask.findById(taskId);

        // If no task is found
        if (!task) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }

        // Update the task's status
        task.status = status;
        await task.save();

        res.status(200).json({
            message: 'Task status updated successfully.',
            task
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({
            message: 'Error updating task status.',
            error: error.message
        });
    }
});

router.get('/compeleted/my-tasks', authMiddleware(['Delivery']), wrapAsync(async (req, res) => {
    const deliveryPerson = req.user.id; // Extract the user ID from the JWT token

    // Find tasks assigned to the logged-in delivery personnel
    const tasks = await DeliveryTask.find({ deliveryPersonnelId: deliveryPerson, status: { $in: ['Delivered'] } }).populate('mealBoxId', 'chartId') // Only fetch specific fields
        .populate('deliveryPersonnelId', 'name')
        .populate('patientInfo', 'name roomNumber')
        .populate('preparationTaskId', 'details'); // Assuming the task model has `assignedTo` field

    // If no tasks found, return a message
    if (!tasks.length) {
        return res.status(200).json({
            message: 'No tasks assigned to you at the moment.',
            tasks: []
        });
    }

    // Respond with the tasks
    res.status(200).json({
        message: 'Assigned tasks retrieved successfully.',
        tasks
    });
}));



module.exports = router;

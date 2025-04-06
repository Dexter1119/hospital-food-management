require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const HospitalAdmin = require('../models/Admin'); // Model for Hospital Admin
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsyncs');

// Secret key for JWT token (use environment variables for better security)
const JWT_SECRET = process.env.JWT_SECRET;

// Validation schema (example using Joi)
const { hospitalAdminValidationSchema } = require('../utils/joiSchema/hospitalAdmin'); // Import your Joi schema

// Middleware for validation
const validateHospitalAdmin = (req, res, next) => {
    const { error } = hospitalAdminValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    }
    next();
};

// POST route to create a new hospital admin
router.post('/', validateHospitalAdmin, wrapAsync(async (req, res) => {
    const { name, email, password, contactInfo } = req.body;

    // Check if an admin with the same email already exists
    const existingAdmin = await HospitalAdmin.findOne({ email });
    if (existingAdmin) {
        throw new ExpressError(400, 'An admin with this email already exists');
    }

    // Create a new hospital admin
    const newAdmin = new HospitalAdmin({
        name,
        email,
        password,
        contactInfo,
    });

    // Save to the database
    await newAdmin.save();

    res.status(201).json({
        message: 'Hospital admin created successfully',
        admin: {
            id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            contactInfo: newAdmin.contactInfo,
        }
    });
}));

// POST route for hospital admin login
router.post('/login', wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    // Validate that email and password are provided
    if (!email || !password) {
        throw new ExpressError(400, 'Email and password are required');
    }

    // Find admin by email
    const admin = await HospitalAdmin.findOne({ email });
    if (!admin) {
        throw new ExpressError(401, 'Invalid email or password');
    }

    // Compare provided password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
        throw new ExpressError(401, 'Invalid email or password');
    }

    // Generate a JWT token
    const token = jwt.sign(
        {
            id: admin._id,
            email: admin.email,
            role: 'Admin',
        },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
    );

    // Send response with token
    res.status(200).json({
        message: 'Login successful',
        token,
    });
}));

module.exports = router;

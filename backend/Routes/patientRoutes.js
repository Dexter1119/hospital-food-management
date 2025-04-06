const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient'); // Import the Patient model
const { PatientSchema } = require('../utils/joiSchema/patient');
const wrapAsync = require("../utils/wrapAsyncs");
const ExpressError = require("../utils/ExpressError");

// Validation middleware
const validatePatient = (req, res, next) => {
    const { error } = PatientSchema.validate(req.body, { abortEarly: false });

    // Extract diseases and allergies from the request body
    const { diseases, allergies } = req.body;

    // Check if 'diseases' is an array
    if (diseases && !Array.isArray(diseases)) {
        return res.status(400).json({ error: '"diseases" must be an array' });
    }

    // Check if 'allergies' is an array
    if (allergies && !Array.isArray(allergies)) {
        return res.status(400).json({ error: '"allergies" must be an array' });
    }

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg); // Pass the validation error to the ExpressError handler
    } else {
        next(); // Proceed to the next middleware if validation passes
    }
};

// Create a new patient
router.post('/', validatePatient, wrapAsync(async (req, res) => {
    const patientData = req.body;  // Patient data is directly in the body

    // Create a new patient record using the data from the request body
    const newPatient = new Patient(patientData);

    // Save to database
    await newPatient.save();

    // Respond with success message and patient data
    res.status(201).json({
        message: 'Patient added successfully',
        patient: newPatient
    });
}));
router.get('/', wrapAsync(async (req, res) => {
    // Retrieve all patients from the database
    const patients = await Patient.find();

    // Respond with the list of patients
    res.status(200).json({
        message: 'Patients retrieved successfully',
        patients: patients
    });
}));

//update the patient details
router.put('/:id', validatePatient, wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract patient ID from the URL
    const updatedData = req.body; // The updated patient data from the request body

    // Find the patient by ID and update their information
    const patient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });

    if (!patient) {
        throw new ExpressError(404, "Patient not found");
    }

    // Respond with the updated patient data
    res.status(200).json({
        message: 'Patient updated successfully',
        patient: patient
    });
}));

// DELETE request to remove a patient by their ID
router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params; // Extract patient ID from request parameters

    try {
        // Find and remove the patient by ID
        const patient = await Patient.findByIdAndDelete(id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Respond with success message
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;

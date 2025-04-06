// utils/joiSchema/patient.js

const Joi = require('joi');

const PatientSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    contactInfo: Joi.string().required(),
    emergencyContact: Joi.string().required(),
    roomNumber: Joi.string().required(),
    bedNumber: Joi.string().required(),
    floorNumber: Joi.string().required(),
    diseases: Joi.array().items(Joi.string()).optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    additionalDetails: Joi.string().optional()
}).unknown(); // Allow additional fields


module.exports = { PatientSchema };

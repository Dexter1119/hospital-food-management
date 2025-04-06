const Joi = require('joi');

// Joi schema for Hospital Admin validation
const hospitalAdminValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 3 characters long.',
            'string.max': 'Name must not exceed 50 characters.',
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required.',
            'string.email': 'Invalid email format.',
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password must not exceed 30 characters.',
        }),

    contactInfo: Joi.string()
        .pattern(/^\d{10}$/) // Ensures exactly 10 digits for a phone number
        .required()
        .messages({
            'string.empty': 'Contact information is required.',
            'string.pattern.base': 'Contact information must be a valid 10-digit number.',
        }),
});

module.exports = { hospitalAdminValidationSchema };

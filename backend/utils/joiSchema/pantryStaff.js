const Joi = require('joi');
const pantryStaffValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    contactInfo: Joi.string().required(),
    location: Joi.string().optional(),
    role: Joi.string().default('Preparation'),
});

module.exports = { pantryStaffValidationSchema };
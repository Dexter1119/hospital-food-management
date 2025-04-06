const Joi = require('joi');

const deliveryPersonnelValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    contactInfo: Joi.string().min(10).max(15).required(),
    additionalDetails: Joi.string().max(255).optional()
});

module.exports = { deliveryPersonnelValidationSchema };

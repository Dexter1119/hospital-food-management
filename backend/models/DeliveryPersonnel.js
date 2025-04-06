const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Define the delivery personnel schema
const deliveryPersonnelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contactInfo: { type: String, required: true },
    additionalDetails: { type: String },
    isAvailable: { type: Boolean, default: true },  // New field to track availability
}, { timestamps: true });

// Middleware to hash passwords before saving
deliveryPersonnelSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Prevent overwriting the model if it already exists
const DeliveryPersonnel = mongoose.models.DeliveryPersonnel || mongoose.model('DeliveryPersonnel', deliveryPersonnelSchema);

module.exports = DeliveryPersonnel;

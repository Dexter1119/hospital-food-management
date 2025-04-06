const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const hospitalAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contactInfo: { type: String, required: true },
}, { timestamps: true });

// Middleware to hash passwords before saving
hospitalAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const HospitalAdmin = mongoose.model('HospitalAdmin', hospitalAdminSchema);

module.exports = HospitalAdmin;

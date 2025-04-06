const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashingssword hashing
const pantryStaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contactInfo: { type: String, required: true },
    location: { type: String },
    role: { type: String, default: 'Preparation' },
}, { timestamps: true });

// Middleware to hash passwords before saving
pantryStaffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
const PantryStaff = mongoose.model('PantryStaff', pantryStaffSchema);

module.exports = PantryStaff;
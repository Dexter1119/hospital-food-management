const mongoose = require('mongoose');

const preparationTaskSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    dietChartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietChart', required: true },
    mealTime: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff', required: true },
    notes: { type: String }
}, { timestamps: true });

const PreparationTask = mongoose.model('PreparationTask', preparationTaskSchema);

module.exports = PreparationTask;
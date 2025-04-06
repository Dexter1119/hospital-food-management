const mongoose = require('mongoose');

const deliveryTaskSchema = new mongoose.Schema({
    mealBoxId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietChart', required: true }, // Renamed for consistency
    deliveryPersonnelId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPersonnel', required: true },
    patientInfo: {
        name: { type: String, required: true },
        roomNumber: { type: String, required: true },
    },
    mealTime: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Delivered'], default: 'Pending' },
    preparationTaskId: { type: mongoose.Schema.Types.ObjectId, ref: 'PreparationTask', required: true },
    assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const DeliveryTask = mongoose.model('DeliveryTask', deliveryTaskSchema);


module.exports = DeliveryTask;

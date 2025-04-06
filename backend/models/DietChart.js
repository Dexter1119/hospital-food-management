const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import the counter model

const dietChartSchema = new mongoose.Schema({
    chartId: {
        type: Number
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Patient model
        ref: 'Patient',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        validate: {
            validator: (value) => value <= Date.now(),
            message: 'Date cannot be in the future',
        },
    },
    meals: [{
        timeOfDay: {
            type: String,
            enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
            required: true
        },
        mealPlan: [{
            type: String,
            required: true,
        }],
        ingredients: [{
            type: String,
            required: true,
        }],
        instructions: {
            type: String,
            default: "",
            trim: true,
        },
    }],
    additionalNotes: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Process', 'Completed', 'Active'],
        default: 'Pending',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
}, {
    timestamps: true,
});

// Pre-save hook to auto-increment chartId
dietChartSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { model: 'DietChart' },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        this.chartId = counter.count;  // Assign the incremented count to chartId
    }
    next();
});

const DietChart = mongoose.model('DietChart', dietChartSchema);

module.exports = DietChart;

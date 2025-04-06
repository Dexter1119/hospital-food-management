const PreparationTask = require('../models/PreparationTask');
const DeliveryTask = require('../models/DeliveryTask');

// API endpoint to track all meal statuses based on mealType (Morning, Evening, Night)
const trackAllMealStatusByMealType = async (req, res) => {
    const { mealType } = req.params; // Extract mealType from request params

    try {
        // Fetch all preparation tasks for the given mealType
        const preparationTasks = await PreparationTask.find({ mealTime: mealType })
            .populate('assignedStaff', 'name contactInfo') // Populate the staff information
            .populate('patientId', 'name roomNumber') // Populate the patient info
            .populate('dietChartId', 'mealName'); // Populate the diet chart meal name

        if (!preparationTasks.length) {
            return res.status(404).json({ message: `No preparation tasks found for ${mealType} meal.` });
        }

        // Fetch associated delivery tasks using preparationTaskId from the preparation task
        const mealStatusList = await Promise.all(preparationTasks.map(async (preparationTask) => {
            const deliveryTask = await DeliveryTask.findOne({
                preparationTaskId: preparationTask._id, // Match preparationTaskId in DeliveryTask
            }).populate('deliveryPersonnelId', 'name contactInfo'); // Populate delivery personnel info

            return {
                patientName: preparationTask.patientId?.name || 'N/A', // Safely access patient name
                patientRoom: preparationTask.patientId?.roomNumber || 'N/A', // Safely access room number
                preparationStatus: preparationTask.status,
                preparationStaff: preparationTask.assignedStaff?.name || 'N/A', // Safely access staff name
                dietChartName: preparationTask.dietChartId?.mealName || 'N/A', // Meal name from diet chart
                deliveryStatus: deliveryTask?.status || 'No Delivery Task', // Safely access delivery status
                deliveryPersonnel: deliveryTask?.deliveryPersonnelId?.name || 'N/A',
                deliveryPersonnelContact: deliveryTask?.deliveryPersonnelId?.contactInfo || 'N/A',
            };
        }));

        // Return the combined list of meal statuses
        res.status(200).json({ mealStatusList });

    } catch (error) {
        console.error('Error tracking meal status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = trackAllMealStatusByMealType;

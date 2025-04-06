const DeliveryTask = require('../models/DeliveryTask'); // Import the DeliveryTask model
const DeliveryPersonnel = require('../models/DeliveryPersonnel'); // Import the DeliveryPersonnel model
const PreparationTask = require('../models/PreparationTask'); // Import the PreparationTask model

const assignDeliveryTask = async (mealBoxId, patientInfo, mealTime) => {
    try {
        // Validate input
        if (!patientInfo.name || !patientInfo.roomNumber) {
            throw new Error('Patient information is incomplete. Both name and room number are required.');
        }
        if (!mealTime) {
            throw new Error('Meal time is required for assigning a delivery task.');
        }

        // Find completed preparation task
        const preparationTask = await PreparationTask.findOne({
            //dietChartId: mealBoxId,
            mealTime,
            status: 'Completed',
        });

        if (!preparationTask) {
            throw new Error(`Preparation task for mealBoxId: ${mealBoxId}, mealTime: ${mealTime || 'undefined'} is not completed yet.`);
        }

        // Find eligible delivery personnel
        const eligiblePersonnel = await DeliveryPersonnel.aggregate([
            {
                $lookup: {
                    from: 'deliverytasks', // Ensure this matches your MongoDB collection name
                    localField: '_id',
                    foreignField: 'deliveryPersonnelId',
                    as: 'tasks',
                },
            },
            {
                $addFields: {
                    taskCount: {
                        $size: {
                            $filter: {
                                input: '$tasks',
                                as: 'task',
                                cond: {
                                    $in: ['$$task.status', ['Completed', 'In Progress', 'Pending']],
                                },
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    isAvailable: true, // Only consider available personnel
                },
            },
            {
                $sort: { taskCount: 1 }, // Select the least-loaded personnel
            },
        ]);

        if (!eligiblePersonnel.length) {
            throw new Error('No eligible delivery personnel found.');
        }

        // Select the least-loaded delivery personnel
        const selectedPersonnel = eligiblePersonnel[0];

        // Create and save a new delivery task
        const deliveryTask = new DeliveryTask({
            mealBoxId,
            deliveryPersonnelId: selectedPersonnel._id,
            patientInfo,
            mealTime,
            preparationTaskId: preparationTask._id, // Use the valid preparation task ID
            status: 'Pending',
        });

        await deliveryTask.save();

        console.log('Delivery task assigned successfully:', deliveryTask);
        return deliveryTask;
    } catch (error) {
        console.error('Error assigning delivery task:', error.message);
        throw new Error('Failed to assign delivery task. Details: ' + error.message);
    }
};


module.exports = assignDeliveryTask;

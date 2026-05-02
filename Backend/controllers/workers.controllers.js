import Workers from "../models/workers.model.js";

/**
 * CREATE WORKER - Creates a new worker profile for authenticated user
 * Validates user is logged in and all required fields are provided
 * Associates worker profile with the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createWorker = async ( req, res, next ) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, skills, bio, hourly_rate, locations, phone_number } = req.body;

        const locationArray = Array.isArray(locations)
            ? locations.map(loc => loc.trim()).filter(Boolean)
            : typeof locations === 'string'
            ? locations.split(',').map(loc => loc.trim()).filter(Boolean)
            : [];

        if(!name || !skills || !bio || !hourly_rate || !phone_number || locationArray.length === 0) {
            return res.status(400).json({ message: 'All fields are required and at least one location must be provided' });
        }

        const newWorker = await Workers.create({
            name,
            skills,
            bio,
            hourly_rate,
            phone_number,
            locations: locationArray,
            user: userId
        });

        res.status(201).json({
            success: true,
            message: 'Worker created successfully',
            data: newWorker
        });
    } catch (e) {
        next(e);
    }
}


/**
 * ALL WORKERS - Retrieves all registered workers from database
 * Validates user is logged in before returning workers list
 * Used to display available workers in the application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const allWorkers = async ( req, res, next ) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const allWorkers = await Workers.find({});
        
        res.status(200).json({
            success: true,
            message: 'All workers retrieved successfully',
            data: allWorkers
        });
    } catch (e) {
        next(e);
    }
}


/**
 * GET MY WORKER PROFILE - Retrieves the worker profile of authenticated user
 * Queries database using the logged-in user's ID
 * Returns worker details or error if worker profile not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getMyWorkerProfile = async ( req, res, next ) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const workerProfile = await Workers.findOne({ user: userId });
        
        res.status(200).json({
            success: true,
            message: 'Worker profile retrieved successfully',
            data: workerProfile
        });
    } catch (e) {
        next(e);
    }
}

export const updateWorkerProfile = async ( req, res, next ) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, skills, bio, hourly_rate, locations, phone_number } = req.body;
        const locationArray = Array.isArray(locations)
            ? locations.map(loc => loc.trim()).filter(Boolean)
            : typeof locations === 'string'
            ? locations.split(',').map(loc => loc.trim()).filter(Boolean)
            : [];

        if(!name || !skills || !bio || !hourly_rate || !phone_number || locationArray.length === 0) {
            return res.status(400).json({ message: 'All fields are required and at least one location must be provided' });
        }

        const updatedWorker = await Workers.findOneAndUpdate(
            { user: userId },
            {
                name,
                skills,
                bio,
                hourly_rate,
                phone_number,
                locations: locationArray
            },
            { returnDocument: 'after' }
        );

        if(!updatedWorker) {
            return res.status(404).json({ message: 'Worker profile not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Worker profile updated successfully',
            data: updatedWorker
        });
    } catch (e) {
        next(e);
    }
}

/**
 * UPDATE WORKER STATUS - Updates the busy/available status of worker
 * Validates isBusy parameter is a boolean value
 * Updates worker's availability status in database
 * Used when worker toggles busy status to indicate they can/cannot accept new jobs
 * @param {Object} req - Express request object containing isBusy in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateWorkerStatus = async ( req, res, next ) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { isBusy } = req.body;

        if(typeof isBusy !== 'boolean') {
            return res.status(400).json({ message: 'isBusy must be a boolean' });
        }

        const updatedWorker = await Workers.findOneAndUpdate(
            { user: userId },
            { isBusy },
            { returnDocument: 'after' }
        );

        if(!updatedWorker) {
            return res.status(404).json({ message: 'Worker profile not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Worker status updated successfully',
            data: updatedWorker
        });
    } catch (e) {
        next(e);
    }
}
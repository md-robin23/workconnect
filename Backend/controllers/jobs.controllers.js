import Jobs from "../models/jobs.model.js";
import User from "../models/user.model.js";

export const postJob = async (req, res, next) => {
    try {
        // Destructure userId from authenticated user (JWT token)
        // Handle both userId and id fields from token
        const userId = req.user?.userId || req.user?.id;
        
        // Destructure fields from request body
        const { title, description, urgency, workCategory, location, payment, jobPosterName, contact } = req.body;
        
        // Validate all required fields including userId from authentication
        if(!title || !description || !urgency || !workCategory || !location || !payment || !jobPosterName || !contact) {
            return res.status(400).json({ message : "All fields are required" });
        }
        
        if(!userId) {
            return res.status(401).json({ message : "User authentication failed. Please login again." });
        }

        // Create new job in database with user's ID as postedBy
        const newJob = await Jobs.create({ 
            title, 
            description, 
            jobPosterName,
            postedBy: userId, 
            urgency, 
            workCategory, 
            location, 
            payment,
            contact
        });

        // Add the new job to user's postedJobs array
        await User.findByIdAndUpdate(userId, {
            $push: { postedJobs: newJob._id }
        });

        res.status(201).json({
            success: true, 
            message: "Job posted successfully",
            data: newJob });

    } catch (e) {
        next(e);
    }
}

export const jobPostedByUser = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const findJob = await User.findById(userId).populate('postedJobs');

        if(!findJob) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: findJob.postedJobs
        });

    } catch (e) {
        next(e);
    }
}

export const getAllJobs = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if(!userId) {
            return res.status(400).json({ message: "User id not found in token" }); 
        }

        const allJobs = await Jobs.find();

        res.json({
            success: true,
            message: "All jobs fetched successfully",
            data: allJobs
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error fetching all jobs"
        });
        next(e);
    }
}
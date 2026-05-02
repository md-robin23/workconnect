import Reviews from "../models/reviews.model.js";
import Workers from "../models/workers.model.js";
import User from "../models/user.model.js";

/**
 * SUBMIT REVIEW - Creates or updates a review for a worker
 * Ensures user is authenticated and validates review data
 * Prevents duplicate reviews (one review per user per worker)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const submitReview = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { workerId, rating, comment, reviewerName } = req.body;

        // Validate required fields
        if (!workerId || !rating || !reviewerName) {
            return res.status(400).json({ message: 'workerId, rating, and reviewerName are required' });
        }

        // Validate reviewer name
        if (typeof reviewerName !== 'string' || reviewerName.trim().length < 2) {
            return res.status(400).json({ message: 'Reviewer name must be at least 2 characters' });
        }

        // Validate rating is between 1-5
        if (rating < 1 || rating > 5 || !Number.isFinite(rating)) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
        }

        // Validate comment length if provided
        if (comment && comment.trim().length > 500) {
            return res.status(400).json({ message: 'Comment cannot exceed 500 characters' });
        }

        // Check if worker exists
        const workerExists = await Workers.findById(workerId);
        if (!workerExists) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Get user posted jobs count and current review count
        const user = await User.findById(userId).select('postedJobs');
        const postedJobsCount = user?.postedJobs?.length || 0;
        const currentReviewCount = await Reviews.countDocuments({ userId });

        // Check if review already exists for this user and worker
        const existingReview = await Reviews.findOne({ workerId, userId });

        if (!existingReview) {
            if (postedJobsCount === 0) {
                return res.status(403).json({ message: 'You must post a job before submitting a review' });
            }
            if (currentReviewCount >= postedJobsCount) {
                return res.status(403).json({ message: 'You have reached your review limit based on posted jobs' });
            }
        }

        let review;
        if (existingReview) {
            // Update existing review
            review = await Reviews.findByIdAndUpdate(
                existingReview._id,
                {
                    rating,
                    reviewerName: reviewerName.trim(),
                    comment: comment || '',
                    updatedAt: new Date(),
                },
                { returnDocument: 'after' }
            );
        } else {
            // Create new review
            review = await Reviews.create({
                workerId,
                userId,
                rating,
                reviewerName: reviewerName.trim(),
                comment: comment || '',
            });
        }

        res.status(existingReview ? 200 : 201).json({
            success: true,
            message: existingReview ? 'Review updated successfully' : 'Review submitted successfully',
            data: review,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET REVIEWS FOR WORKER - Retrieves all reviews for a specific worker
 * Includes user information for each review
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getWorkerReviews = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { workerId } = req.params;

        // Check if worker exists
        const workerExists = await Workers.findById(workerId);
        if (!workerExists) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Get all reviews for the worker
        const reviews = await Reviews.find({ workerId })
            .select('-userId')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            message: 'Worker reviews retrieved successfully',
            data: {
                reviews,
                totalReviews,
                averageRating,
            },
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET USER'S REVIEW FOR WORKER - Retrieves the logged-in user's review for a specific worker
 * Used to check if user has already reviewed this worker
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserReviewForWorker = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { workerId } = req.params;

        const review = await Reviews.findOne({ workerId, userId });

        res.status(200).json({
            success: true,
            message: 'User review retrieved successfully',
            data: review,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET USER'S REVIEWS - Retrieves all reviews submitted by the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getUserReviews = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const reviews = await Reviews.find({ userId })
            .populate('workerId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'User reviews retrieved successfully',
            data: reviews,
        });
    } catch (e) {
        next(e);
    }
};

/**
 * DELETE REVIEW - Deletes a review (only by the reviewer)
 * Ensures user can only delete their own reviews
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteReview = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { reviewId } = req.params;

        // Check if review exists and belongs to the user
        const review = await Reviews.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }

        await Reviews.findByIdAndDelete(reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (e) {
        next(e);
    }
};

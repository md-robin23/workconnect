import express from 'express';
import { authorizationMiddleware } from '../middleware/authorization.js';
import {
    submitReview,
    getWorkerReviews,
    getUserReviewForWorker,
    getUserReviews,
    deleteReview,
} from '../controllers/reviews.controllers.js';

const reviewsRouter = express.Router();

// Post a new review or update existing review for a worker
reviewsRouter.post('/', authorizationMiddleware, submitReview);

// Get all reviews for a specific worker (with average rating and count)
reviewsRouter.get('/worker/:workerId', authorizationMiddleware, getWorkerReviews);

// Get the logged-in user's review for a specific worker
reviewsRouter.get('/worker/:workerId/my-review', authorizationMiddleware, getUserReviewForWorker);

// Get all reviews submitted by the logged-in user
reviewsRouter.get('/user/my-reviews', authorizationMiddleware, getUserReviews);

// Delete a review (only by the reviewer)
reviewsRouter.delete('/:reviewId', authorizationMiddleware, deleteReview);

export default reviewsRouter;

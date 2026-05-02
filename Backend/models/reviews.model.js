import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workers',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewerName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Compound index to ensure one review per user per worker
reviewSchema.index({ workerId: 1, userId: 1 }, { unique: true });

const Reviews = mongoose.model('Reviews', reviewSchema);
export default Reviews;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobSchema = new Schema({
    title: {
        type : String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    jobPosterName: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    urgency: {
        type: String,
        required: true, 
        enum: ['ASAP', 'FLEXIBLE', 'URGENT'],
    },
    workCategory: {
        type: String,
        required: true,
        enum: ['cleaning', 'moving', 'gardening', 'plumbing', 'electrical', 'painting', 'tech help','tutoring', 'cooking','other'],
    },
    location: {
        type: String,
        required: true,
    },
    payment: {
        type: Number,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    }
    // postedOn: {
    //     type: Date,
    //     default: Date.now
    // }
}, { timestamps: true });

const Jobs = mongoose.model('Jobs', jobSchema);
export default Jobs;
import mongoose, { mongo } from 'mongoose';
const { Schema } = mongoose;

const workerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    skills: [{
        type: String,
        required: true,
        enum: ['cleaning', 'moving', 'gardening', 'plumbing', 'electrical', 'painting', 'tech help','tutoring', 'cooking','other'],
    }],
    bio: {
        type: String,
        required: true,
    },
    hourly_rate: {
        type: Number,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    locations: [{
        type: String,
        required: true,
        trim: true,
    }],
    isBusy: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    }
}, { timestamps: true });

const Workers = mongoose.model('Workers', workerSchema);
export default Workers;
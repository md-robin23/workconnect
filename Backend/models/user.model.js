import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxLength: 11,
        minLength: 11,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
    postedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jobs',
        }
    ]
},{
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

const User = mongoose.model('User',userSchema);
export default User;
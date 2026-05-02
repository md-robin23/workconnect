import mongoose from "mongoose";
import { DB_URL } from "../config/env.js";

if(!DB_URL) {
    throw new Error('Please define the MONGODB_URI variabel inside .env<develeopmet/production>.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log(`✅ Connected to MongoDB database (${process.env.NODE_ENV || 'development'} mode)`);
    } catch (e) {
        console.error('Error connecting to database: ', e);
    }
}

export default connectToDatabase;
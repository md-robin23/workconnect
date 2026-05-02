import express from 'express';
import path from 'path';//This line added by AI
import { fileURLToPath } from 'url'; // This line added by AI
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
import jobsRouter from './routes/jobs.routes.js';
import workersRouter from './routes/workers.routes.js';
import reviewsRouter from './routes/reviews.routes.js';

const __filename = fileURLToPath(import.meta.url);// This line added by AI
const __dirname = path.dirname(__filename);// This line added by AI
const app = express();

// Serve static files from Frontend folder
app.use(express.static(path.join(__dirname, '../Frontend')));// This line added by AI
app.use(cors());

app.use(express.json());

app.use('/api/r1/auth', userRouter);
app.use('/api/r1/jobs', jobsRouter);
app.use('/api/r1/workers', workersRouter);
app.use('/api/r1/reviews', reviewsRouter);

// PUBLIC STATS ENDPOINT - Returns job and worker counts (no auth required)
app.get('/api/r1/stats', async (req, res) => {
    try {
        const Jobs = (await import('./models/jobs.model.js')).default;
        const Workers = (await import('./models/workers.model.js')).default;
        
        const jobsCount = await Jobs.countDocuments();
        const workersCount = await Workers.countDocuments();
        
        res.status(200).json({
            success: true,
            activeJobs: jobsCount,
            workers: workersCount
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            activeJobs: 0,
            workers: 0
        });
    }
});

app.get('/api', (req, res) => {
    res.send({ message: 'This is workconnect app API' });
});

app.use((err, req, res, next) => {
    console.error(err.message);

    // Duplicate key error from MongoDB
    if(err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // e.g. "phone_number"
        return res.status(409).json({
            success: false,
            error: `${field} already exists`
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

// Start server after database connects
(async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
})();

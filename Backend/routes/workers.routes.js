import express from 'express';
import { authorizationMiddleware } from '../middleware/authorization.js';
import { allWorkers, createWorker, getMyWorkerProfile, updateWorkerProfile, updateWorkerStatus } from '../controllers/workers.controllers.js';

const workersRouter = express.Router();

workersRouter.post('/user', authorizationMiddleware, createWorker);
workersRouter.put('/user', authorizationMiddleware, updateWorkerProfile);
workersRouter.get('/user/profile', authorizationMiddleware, getMyWorkerProfile);
workersRouter.put('/user/status', authorizationMiddleware, updateWorkerStatus);
workersRouter.get('/', authorizationMiddleware, allWorkers);

export default workersRouter;
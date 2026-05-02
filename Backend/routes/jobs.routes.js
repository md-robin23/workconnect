import express from "express";
import { postJob, jobPostedByUser, getAllJobs } from "../controllers/jobs.controllers.js";
import { authorizationMiddleware } from "../middleware/authorization.js";

const jobsRouter = express.Router();

jobsRouter.post('/', authorizationMiddleware, postJob);
jobsRouter.get('/user', authorizationMiddleware, jobPostedByUser);
jobsRouter.get('/', authorizationMiddleware, getAllJobs);

export default jobsRouter;
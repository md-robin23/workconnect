import express from 'express';
import { logIn, signUp, sendOtp, verifyOtp } from '../controllers/auth.controllers.js';
const userRouter = express.Router();

userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/sign-up' ,signUp);
userRouter.post('/log-in', logIn);

export default userRouter; 
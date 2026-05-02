import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { JWT_SECRET_KEY, JWT_EXPIRES_IN, SMS_API_KEY, SMS_API_URL } from '../config/env.js'

// Temporary OTP storage (use Redis in production)
const otpStore = new Map();


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); 
    session.startTransaction();

    try {
        const { phoneNumber ,password } = req.body;

        if (!phoneNumber || !password) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isExistsUser = await User.findOne({ phoneNumber }).session(session);

        if(isExistsUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create([{ phoneNumber, password: hashedPassword }], { session });

        const token = jwt.sign(
            {userId : newUser[0]._id,
            phoneNumber: newUser[0].phoneNumber 
            },
            JWT_SECRET_KEY,
            {expiresIn: JWT_EXPIRES_IN}
        )

        await session.commitTransaction();
        session.endSession();


        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: {
                token, 
                user: newUser[0],
            }
        });
    } catch (e) {
        await session.abortTransaction()
        session.endSession();
        next(e);
    }
}

export const logIn = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body;
        if(!phoneNumber || !password) {
            return res.status(400).json({ 'message': 'Invalid information'});
        }

        const userExists = await User.findOne({ phoneNumber });
        if(!userExists) {
            return res.status(400).json({ message : "User is not valid"});
        }

        const matchPassword = await bcrypt.compare(password, userExists.password);
        if(!matchPassword) {
            return res.status(400).json({ message: 'Password is invalid'});
        }

        const token = jwt.sign({userId: userExists._id, phoneNumber: userExists.phoneNumber}, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            success: true,
            message: 'Log in successufll',
            data: {
                token,
                userExists,
            }
        })
    } catch (e) {
        next(e);
    }   
}

export const sendOtp = async (req, res, next) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate phone number format (11 digits)
        if (!/^[0-9]{11}$/.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Format phone number for SMS API (8801XXXXXXXX)
        const formattedPhone = phoneNumber.startsWith('0') ? '88' + phoneNumber : phoneNumber;

        // Send SMS via provider endpoint using required query string parameters
        const urlParams = new URLSearchParams({
            api_key: SMS_API_KEY,
            msg: `Your OTP for Workconnect is: ${otp}`,
            to: formattedPhone
        });
        const requestUrl = `${SMS_API_URL}?${urlParams.toString()}`;

        const smsResponse = await fetch(requestUrl, {
            method: 'GET'
        });

        const responseText = await smsResponse.text();
        if (!smsResponse.ok) {
            console.error('SMS API error:', responseText);
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        let smsData;
        try {
            smsData = JSON.parse(responseText);
        } catch {
            smsData = responseText;
        }
        console.log('✅ OTP sent successfully to', phoneNumber);
        // Store OTP temporarily (expires in 5 minutes)
        otpStore.set(phoneNumber, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        const storedOtpData = otpStore.get(phoneNumber);

        if (!storedOtpData) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        if (Date.now() > storedOtpData.expiresAt) {
            otpStore.delete(phoneNumber);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP verified successfully
        otpStore.delete(phoneNumber); // Remove used OTP

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

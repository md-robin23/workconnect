import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, DB_URL, JWT_SECRET_KEY, JWT_EXPIRES_IN, SMS_API_KEY, SMS_API_URL } = process.env;
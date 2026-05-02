import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';

export const authorizationMiddleware = (req, res, next) => {
    try {
        // Extract the authorization header from the request (format: "Bearer <token>")
        const authHeader = req.headers['authorization'];
        // Extract the token from the header by splitting on space and taking the second part
        if(!authHeader || ! authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Access denied. No token provided or wrong format.'});
        }
        const token = authHeader.split(' ')[1];
    
        if(!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token using the secret key and decode its payload
        const decode = jwt.verify(token, JWT_SECRET_KEY);
        // Attach the decoded user information to the request object for use in next middleware/route
        req.user = decode;
        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (e) {
        // Handle any errors (invalid or expired token) and return 403 Forbidden status
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
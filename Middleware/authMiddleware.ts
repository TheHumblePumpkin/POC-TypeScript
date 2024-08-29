/* This middleware will ensure that only authenticated users with valid tokens can access the protected routes. */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../Models/userSchema';

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;  // Cast req to AuthenticatedRequest
        const token = authReq.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        authReq.user = user;  // Attach user to the request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;  // Default export

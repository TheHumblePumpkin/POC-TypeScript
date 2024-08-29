/* Each function is designed to handle specific user profile tasks:
Registration, Authentication,Profile management, and Profile picute  */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../Models/userSchema';

interface AuthenticatedRequest extends Request {
    user?: IUser;  // Add the user property with the IUser type
}

// Registration
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, profileImage, profileImageFormat } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            profileImage,
            profileImageFormat
        } as IUser);
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email }) as IUser | null;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,  // payload: user id
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,  // secret key
            { expiresIn: '1h' }  // token expiration time
        );

        // Respond with the user data and the token
        res.status(200).json({
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: `data:image/${user.profileImageFormat};base64,${user.profileImage}`,
            token  // Return the generated JWT token
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Logged-In User
export const getLoggedInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as AuthenticatedRequest;  // Cast req to AuthenticatedRequest
        const userId = authReq.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: `data:image/${user.profileImageFormat};base64,${user.profileImage}`
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Upload profile image
export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        if (!req.file) {
            res.status(400).json({ message: "Image file is required" });
            return;
        }

        const imgBuffer = req.file.buffer;
        const base64Data = imgBuffer.toString('base64');
        const imageFormat = req.file.mimetype.split('/')[1];

        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: base64Data, profileImageFormat: imageFormat },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            user: {
                ...user.toObject(),
                profileImage: base64Data
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get profile image by user ID
export const getProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user || !user.profileImage) {
            res.status(404).json({ message: 'User or profile image not found' });
            return;
        }

        const imgBuffer = Buffer.from(user.profileImage, 'base64');
        const contentType = user.profileImageFormat === 'png' ? 'image/png' : 'image/jpeg';
        res.setHeader('Content-Type', contentType);

        res.send(imgBuffer);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

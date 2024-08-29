import express, { Router } from 'express';
import multer from 'multer';
import * as userController from '../Controllers/userController';
import authMiddleware from '../Middleware/authMiddleware';

const router: Router = express.Router();

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/:id/upload', upload.single('image'), userController.uploadProfileImage);
router.get('/:id/profileImage', userController.getProfileImage);

// Protected routes
router.get('/', authMiddleware, userController.getAllUsers);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;

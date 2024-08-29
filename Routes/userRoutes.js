"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var userController = require("../Controllers/userController");
var authMiddleware_1 = require("../Middleware/authMiddleware");
var router = express_1.default.Router();
// Setup multer for file uploads
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({ storage: storage });
// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/:id/upload', upload.single('image'), userController.uploadProfileImage);
router.get('/:id/profileImage', userController.getProfileImage);
// Protected routes
router.get('/', authMiddleware_1.default, userController.getAllUsers);
router.delete('/:id', authMiddleware_1.default, userController.deleteUser);
exports.default = router;

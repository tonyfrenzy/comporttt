import express from 'express';
import multer from 'multer';

import UserController from '../controllers/UserController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
 
// USER ROUTES
router.post("/register", UserController.register);
router.post("/login", UserController.login);

export default router;

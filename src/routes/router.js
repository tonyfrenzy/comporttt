import express from 'express';
import multer from 'multer';

import userRouter from './userRoutes.js';
import adminRouter from './adminRoutes.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// USER ROUTES
router.use('/users', userRouter)
router.use('/admins', adminRouter)

export default router;

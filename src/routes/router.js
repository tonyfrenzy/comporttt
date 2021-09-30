import express from 'express';
import multer from 'multer';

import userRouter from './userRoutes.js';
import adminRouter from './adminRoutes.js';
import categoryRouter from './categoryRoutes.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// ROUTES
router.use('/users', userRouter)
router.use('/admins', adminRouter)
router.use('/categories', categoryRouter)

export default router;

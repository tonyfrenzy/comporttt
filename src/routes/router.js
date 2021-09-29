import express from 'express';
import multer from 'multer';

// import UserController from '../controllers/UserController.js';

import userRouter from './userRoutes.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();


// USER ROUTES
router.use('/users', userRouter)

// router.post("/register", UserController.register);
// router.post("/login", UserController.login);
// router.post("/:username", UserController.profile);

export default router;

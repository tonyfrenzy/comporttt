import { Router } from 'express';
import cors from 'cors';
import UserController from '../controllers/UserController.js';
import authValidator from '../middlewares/AuthValidator.js';

const router = Router();

router.route('/register')
    .post(UserController.register);
router.route('/login')
    .post(UserController.login);
router.route('/:username')
    .get(authValidator, UserController.profile)
    ;

export default router;
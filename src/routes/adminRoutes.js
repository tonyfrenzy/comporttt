import { Router } from 'express';
import cors from 'cors';
import AdminController from '../controllers/AdminController.js';
import authValidator from '../middlewares/AuthValidator.js';
import AdminMiddleware from '../middlewares/AdminMiddleware.js';

const router = Router();

router.route('/new')
    .post(AdminController.makeAdmin);
router.route('/login')
    .post(AdminController.login);
router.route('/dashboard')
    .get([ authValidator, AdminMiddleware ], AdminController.dashboard)
    ;

export default router;
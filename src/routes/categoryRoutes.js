import { Router } from 'express';
import cors from 'cors';
import CategoryController from '../controllers/CategoryController.js';
import authValidator from '../middlewares/AuthValidator.js';
import AdminMiddleware from '../middlewares/AdminMiddleware.js';

const router = Router();

router.route('/')
    .get(CategoryController.index)
    .get(CategoryController.show)
    .post([ authValidator, AdminMiddleware ], CategoryController.create)

router.route('/:id')
    .put([ authValidator, AdminMiddleware ], CategoryController.update)
    .delete([ authValidator, AdminMiddleware ], CategoryController.destroy)
    ;

export default router;
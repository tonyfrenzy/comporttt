import { Router } from 'express';
import cors from 'cors';
import KnowledgebaseController from '../controllers/KnowledgebaseController.js';
import authValidator from '../middlewares/AuthValidator.js';
import AdminMiddleware from '../middlewares/AdminMiddleware.js';

const router = Router();

router.route('/')
    .get(KnowledgebaseController.index)
    .post([ authValidator, AdminMiddleware ], KnowledgebaseController.create)

router.route('/:id')
    .get(KnowledgebaseController.show)
    .put([ authValidator, AdminMiddleware ], KnowledgebaseController.update)
    .delete([ authValidator, AdminMiddleware ], KnowledgebaseController.destroy)
    ;

export default router;
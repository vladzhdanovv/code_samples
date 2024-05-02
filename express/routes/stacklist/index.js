import {Router} from 'express';
import {isAuth} from '../../middleware/isAuth.js';
import {stackListController} from '../../modules/controllers/stackList.controller.js';

export const stackListRoutes = {
    general: '/',
    cancel: '/cancel/item/:itemId',
    delete: '/delete'
};

const router = Router();

router.post(stackListRoutes.general, isAuth(), stackListController.createTasks);
router.get(stackListRoutes.cancel, isAuth(), stackListController.cancelJob);

router.delete(stackListRoutes.delete, isAuth(), stackListController.deletePost);

export default router;

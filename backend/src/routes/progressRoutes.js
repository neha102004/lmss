import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as progressController from '../controllers/progressController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', progressController.saveProgress);
router.get('/', progressController.getAllProgress);
router.get('/:videoId', progressController.getProgress);

export default router;

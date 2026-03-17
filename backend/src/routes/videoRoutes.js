import { Router } from 'express';
import * as videoController from '../controllers/videoController.js';

const router = Router();

router.get('/:id', videoController.getVideoById);

export default router;

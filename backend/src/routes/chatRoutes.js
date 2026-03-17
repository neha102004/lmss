import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as chatController from '../controllers/chatController.js';

const router = Router();

router.post('/', authMiddleware, chatController.chat);

export default router;

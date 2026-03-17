import { Router } from 'express';
import * as subjectController from '../controllers/subjectController.js';

const router = Router();

router.get('/', subjectController.getSubjects);
router.get('/:id', subjectController.getSubjectById);

export default router;

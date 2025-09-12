import { Router } from 'express';
import { listAction, detailAction } from './controller.js';

const router = Router();

router.get('/', listAction);
router.get('/:id', detailAction);

export { router };

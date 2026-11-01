import { Router } from 'express';
import { createSupportCase, listSupportCases, resolveSupportCase } from './supportController.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createSupportCase);
router.get('/', listSupportCases);
router.patch('/:id/resolve', requireRole('ADMIN'), resolveSupportCase);

export default router;


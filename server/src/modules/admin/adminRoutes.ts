import { Router } from 'express';
import {
  getAdminSummary,
  listDriverApplications,
  reviewDriverDecision,
  listAllUsers,
  updateUserAccountStatus,
  listPricingRules,
  updatePricingRule,
  listAuditLogs,
} from './adminController.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/summary', getAdminSummary);
router.get('/drivers', listDriverApplications);
router.patch('/drivers/:id/decision', reviewDriverDecision);
router.get('/users', listAllUsers);
router.patch('/users/:id/status', updateUserAccountStatus);
router.get('/pricing', listPricingRules);
router.patch('/pricing/:id', updatePricingRule);
router.get('/audit-logs', listAuditLogs);

export default router;


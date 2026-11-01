import { Router } from 'express';
import { listVehicles, addVehicle, updateVehicle, deleteVehicle } from './vehicleController.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('CUSTOMER', 'ADMIN'));

router.get('/', listVehicles);
router.post('/', addVehicle);
router.patch('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;


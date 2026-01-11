import express from 'express';
import { AdminControllers } from './admin.controller';

const router = express.Router();

const validateRequest = () => {
    console.log('checker');
}

router.get('/', AdminControllers.getAdmin)
router.get('/:id', AdminControllers.getAdminById)
router.patch('/:id', AdminControllers.updateAdmin)

export const AdminRoutes = router;
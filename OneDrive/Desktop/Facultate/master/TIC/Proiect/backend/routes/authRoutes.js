import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/current', authenticateUser, authController.getCurrentUser);
router.post('/login', authController.login);
router.post('/profile', authenticateUser, authController.updateUserProfile);
router.post('/create-profile', authenticateUser, authController.createUserWithDetails);

export default router;

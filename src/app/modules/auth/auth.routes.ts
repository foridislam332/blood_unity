import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

export const AuthRoutes = router;
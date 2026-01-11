import express from 'express';
import { auth } from '../../middlewares/auth';
import { RequestControllers } from './request.controller';

const router = express.Router();

router.get('/', auth(), RequestControllers.getRequests)
router.post('/', auth(), RequestControllers.createRequest)

export const RequestRoutes = router;
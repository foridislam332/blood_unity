import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { RequestRoutes } from '../modules/request/request.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/request',
        route: RequestRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
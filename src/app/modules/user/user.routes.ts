import express from "express";
import { UserControllers } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get('/', auth([UserRole.ADMIN]), UserControllers.getUsers)
router.post('/', UserControllers.createUser)
router.get('/me', auth(), UserControllers.getMyProfile)

export const UserRoutes = router;
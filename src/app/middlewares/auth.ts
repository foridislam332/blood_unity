import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyToken } from "../utils/jwt";
import { UserRole } from "../../generated/prisma/enums";

export const auth = (roles: string[] = [UserRole.USER]) => {
    return async (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
        // Check for token in multiple locations
        let token = req.cookies?.['accessToken'] ||
            req.headers.authorization?.split(' ')[1] ||
            req.headers['x-access-token'] as string;

        // Also check for token in query string (for testing)
        if (!token && req.query.token) {
            token = req.query.token as string;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.'
            });
            return;
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        if (roles.length > 0 && !roles.includes(decoded.role)) {
            throw new Error('Unauthorized access!');
        }

        next();
    }
}
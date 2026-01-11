import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyToken } from "../utils/jwt";
import { UserRole } from "../../generated/prisma/enums";
import { AuthenticationError, AuthorizationError } from "../errors";

export const auth = (roles: string[] = [UserRole.USER]) => {
    return async (req: Request & { user?: JwtPayload }, _res: Response, next: NextFunction) => {
        // Check for token in multiple locations
        let token = req.cookies?.['accessToken'] ||
            req.headers.authorization ||
            req.headers['x-access-token'] as string;

        // Also check for token in query string (for testing)
        if (!token && req.query.token) {
            token = req.query.token as string;
        }
        if (!token) {
            throw new AuthenticationError;
        }

        const decoded = verifyToken(token);
        req.user = decoded;

        if ((roles.length > 0 && !roles.includes(UserRole.USER)) && !roles.includes(decoded.role)) {
            throw new AuthorizationError;
        }

        next();
    }
}
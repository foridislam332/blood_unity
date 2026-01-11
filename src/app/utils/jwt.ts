import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// Ensure proper typing for environment variables
const JWT_SECRET = env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '2d';
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET or JWT_REFRESH_SECRET environment variable is not defined');
}
export interface JwtPayload {
    phone: string;
    role: UserRole;
    id: string;
}

// Generate Access Token
export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

// Generate Refresh Token
export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};

// Verify Access Token
export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};

// Middleware: Verify Access Token
export const verifyJwt = (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
): void => {
    try {
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
        next();
    } catch (err: any) {
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Middleware: Verify Admin
export const verifyAdmin = (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    // Allow admin role
    const adminRoles = [UserRole.ADMIN];

    if (!adminRoles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: 'Forbidden: Admin access required'
        });
        return;
    }

    next();
};

// Middleware: Verify Super Admin
export const verifySuperAdmin = (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    // Allow super_admin role
    const adminRoles = [UserRole.SUPER_ADMIN];

    if (!adminRoles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: 'Forbidden: Super Admin access required'
        });
        return;
    }

    next();
};
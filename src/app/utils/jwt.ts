import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../../generated/prisma/enums';

// Ensure proper typing for environment variables
const JWT_SECRET = env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '2d';
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET or JWT_REFRESH_SECRET environment variable is not defined');
}
export interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
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
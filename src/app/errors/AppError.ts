import { ErrorInfo, IAppError } from "./errorTypes";

export class AppError extends Error implements IAppError {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errorCode?: string;
    public readonly details?: unknown;
    public readonly timestamp: string;

    constructor(errorInfo: ErrorInfo) {
        const { statusCode, message, errorCode, isOperational = true, details } = errorInfo;

        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorCode = errorCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific Error Classes
export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super({
            statusCode: 400,
            message,
            errorCode: 'VALIDATION_ERROR',
            details
        });
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super({
            statusCode: 401,
            message,
            errorCode: 'AUTHENTICATION_ERROR'
        });
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super({
            statusCode: 403,
            message,
            errorCode: 'AUTHORIZATION_ERROR'
        });
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super({
            statusCode: 404,
            message: `${resource} not found`,
            errorCode: 'NOT_FOUND_ERROR'
        });
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super({
            statusCode: 409,
            message,
            errorCode: 'CONFLICT_ERROR'
        });
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super({
            statusCode: 429,
            message,
            errorCode: 'RATE_LIMIT_ERROR'
        });
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super({
            statusCode: 500,
            message,
            errorCode: 'INTERNAL_SERVER_ERROR',
            isOperational: false
        });
    }
}
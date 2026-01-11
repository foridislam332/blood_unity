import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ErrorResponse, IAppError } from '../errors';
import logger from '../utils/logger';

const handleJWTError = (): AppError =>
    new AppError({
        statusCode: 401,
        message: 'Invalid token. Please log in again.',
        errorCode: 'INVALID_TOKEN',
    });

const handleJWTExpiredError = (): AppError =>
    new AppError({
        statusCode: 401,
        message: 'Your token has expired. Please log in again.',
        errorCode: 'TOKEN_EXPIRED',
    });

const sendErrorDev = (err: IAppError, req: Request, res: Response): void => {
    const errorResponse: ErrorResponse = {
        success: false,
        message: err.message,
        errorCode: err.errorCode,
        details: err.details,
        timestamp: err.timestamp,
        path: req.originalUrl,
    };

    res.status(err.statusCode).json(errorResponse);
};

const sendErrorProd = (err: IAppError, req: Request, res: Response): void => {
    if (err.isOperational) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            timestamp: err.timestamp,
        };

        res.status(err.statusCode).json(errorResponse);
    } else {
        logger.error('ERROR 💥', {
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });

        res.status(500).json({
            success: false,
            message: 'Something went wrong!',
            timestamp: new Date().toISOString(),
        });
    }
};

export const globalErrorHandler = (
    err: Error | IAppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error: IAppError;

    if (!(err instanceof AppError)) {
        error = new AppError({
            statusCode: 500,
            message: err.message,
            isOperational: false,
        });
    } else {
        error = err;
    }

    // Log error
    logger.error({
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: (req as any).user?._id || 'anonymous',
    });

    // Handle specific error types
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else {
        sendErrorProd(error, req, res);
    }
};
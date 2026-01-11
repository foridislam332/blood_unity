export interface ErrorResponse {
    success: false;
    message: string;
    errorCode?: string;
    details?: unknown;
    timestamp: string;
    path?: string;
}

export interface ErrorInfo {
    statusCode: number;
    message: string;
    errorCode?: string;
    isOperational?: boolean;
    details?: unknown;
}

export interface IAppError extends Error {
    statusCode: number;
    isOperational: boolean;
    errorCode?: string;
    details?: unknown;
    timestamp: string;
}
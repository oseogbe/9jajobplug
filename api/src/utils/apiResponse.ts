import { Response } from 'express'

interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
    error?: {
        code: string
        details?: any
    }
    meta?: {
        page?: number
        limit?: number
        total?: number
    }
}

const createSuccessResponse = <T>(
    data: T,
    message: string = 'Success',
    meta?: ApiResponse['meta']
): ApiResponse<T> => ({
    success: true,
    message,
    data,
    meta,
})

const createErrorResponse = (
    message: string,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: any
): ApiResponse => ({
    success: false,
    message,
    error: {
        code,
        details,
    },
})

export const sendSuccessResponse = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: ApiResponse['meta']
): Response => {
    return res.status(statusCode).json(createSuccessResponse(data, message, meta))
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code: string = 'INTERNAL_SERVER_ERROR',
        public details?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export const sendErrorResponse = (
    res: Response,
    error: ApiError
): Response => {
    return res.status(error.statusCode).json(
        createErrorResponse(error.message, error.code, error.details)
    )
}

// Common HTTP status codes
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const

// Common error codes
export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const 
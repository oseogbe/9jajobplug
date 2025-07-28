/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { ApiError, sendErrorResponse, HttpStatus, ErrorCodes } from '@/utils/apiResponse'
import { logger } from '@/lib/winston'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        logger.error('ApiError caught:', err)
        sendErrorResponse(res, err)
        return 
    }

    if (err instanceof TokenExpiredError) {
        logger.error('Refresh token expired:', err)
        sendErrorResponse(
            res,
            new ApiError(
                HttpStatus.UNAUTHORIZED,
                'Refresh token expired, please login again',
                ErrorCodes.UNAUTHORIZED
            )
        )
        return
    }

    if (err instanceof JsonWebTokenError) {
        logger.error('Invalid refresh token:', err)
        sendErrorResponse(
            res,
            new ApiError(
                HttpStatus.UNAUTHORIZED,
                'Invalid refresh token',
                ErrorCodes.UNAUTHORIZED
            )
        )
        return
    }
    
    // Fallback for other errors
    logger.error('Unhandled error caught:', err)
    const apiError = new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An error occurred! Please try again later.',
        ErrorCodes.INTERNAL_SERVER_ERROR
    )
    sendErrorResponse(res, apiError)
}

export default errorHandler
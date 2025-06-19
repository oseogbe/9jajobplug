/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Request, Response, NextFunction } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

/**
 * custom modules
 */
import { verifyAccessToken } from '@/lib/jwt'
import { logger } from '@/lib/winston'
import { ApiError, ErrorCodes, HttpStatus, sendErrorResponse } from '@/utils/apiResponse'

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    // If there's no bearer token, deny access
    if (!authHeader?.startsWith('Bearer ')) {
        sendErrorResponse(
            res,
            new ApiError(
                HttpStatus.UNAUTHORIZED,
                'Unauthorized',
                ErrorCodes.UNAUTHORIZED
            )
        )
        return
    }

    const [_, token] = authHeader.split(' ')

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: string }

        req.userId = jwtPayload.userId

        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            sendErrorResponse(
                res,
                new ApiError(
                    HttpStatus.UNAUTHORIZED,
                    'Access token expired, request a new one with refresh token',
                    ErrorCodes.UNAUTHORIZED
                )
            )
            return
        }

        if (error instanceof JsonWebTokenError) {
            sendErrorResponse(
                res,
                new ApiError(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid access token',
                    ErrorCodes.UNAUTHORIZED
                )
            )
            return
        }
        
        sendErrorResponse(
            res,
            new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Internal server error',
                ErrorCodes.INTERNAL_SERVER_ERROR
            )
        )

        logger.error('Error during authentication')
    }
}

export default authenticate
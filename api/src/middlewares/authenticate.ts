/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Request, Response, NextFunction } from 'express'

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

    const jwtPayload = verifyAccessToken(token) as { userId: string }

    req.userId = jwtPayload.userId

    next()
}

export default authenticate
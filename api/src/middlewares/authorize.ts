/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * custom modules
 */
import { logger } from "@/lib/winston"
import { prisma } from "@/lib/prisma"
import { 
    ApiError, 
    HttpStatus, 
    ErrorCodes, 
    sendErrorResponse 
} from '@/utils/apiResponse'

/**
 * types
 */
import type { Request, Response, NextFunction } from 'express'

export type AuthRole = 'recruiter' | 'talent'

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if(!user) {
                sendErrorResponse(
                    res,
                    new ApiError(
                        HttpStatus.NOT_FOUND,
                        'User not found',
                        ErrorCodes.NOT_FOUND
                    )
                )
                return
            }

            if(!roles.includes(user.role)) {
                sendErrorResponse(
                    res,
                    new ApiError(
                        HttpStatus.FORBIDDEN,
                        'Access denied, insufficient permissions',
                        ErrorCodes.FORBIDDEN
                    )
                )
                return
            }

            next()
        } catch (error) {
            sendErrorResponse(
                res,
                new ApiError(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Internal server error',
                    ErrorCodes.INTERNAL_SERVER_ERROR
                )
            )
    
            logger.error('Error while authorizing user', error)
        }
    }
}

export default authorize
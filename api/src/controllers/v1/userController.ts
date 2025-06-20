/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * custom modules
 */
import config from '@/config'
import { logger } from '@/lib/winston'
import { prisma } from '@/lib/prisma'
import { 
    ApiError, 
    HttpStatus, 
    ErrorCodes, 
    sendSuccessResponse, 
    sendErrorResponse 
} from '@/utils/apiResponse'

/**
 * types
 */
import type { Request, Response } from 'express'


const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        sendSuccessResponse(
            res,
            {
                user
            },
            'User data retrieved',
            HttpStatus.OK
        )
    } catch (error) {
        if (error instanceof ApiError) {
            sendErrorResponse(res, error)
        } else {
            sendErrorResponse(
                res,
                new ApiError(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Failed to login',
                    ErrorCodes.INTERNAL_SERVER_ERROR
                )
            )
        }

        logger.error('Error while getting current user', error)
    }
}

export {
    getCurrentUser
}
/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * custom modules
 */
import { prisma } from '@/lib/prisma'
import {
    ApiError,
    HttpStatus,
    ErrorCodes,
    sendSuccessResponse
} from '@/utils/apiResponse'

/**
 * types
 */
import type { Request, Response } from 'express'


const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(
            HttpStatus.UNAUTHORIZED,
            'Incorrect login credentials',
            ErrorCodes.UNAUTHORIZED
        )
    }

    const userDetails = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
    }

    sendSuccessResponse(
        res,
        {
            user: userDetails
        },
        'User data retrieved',
        HttpStatus.OK
    )
}

export {
    getCurrentUser
}
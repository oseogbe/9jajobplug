/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * custom modules
 */
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

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
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

        if (!roles.includes(user.role)) {
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
    }
}

export default authorize
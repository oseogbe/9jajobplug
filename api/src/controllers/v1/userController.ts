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
        role: user?.role
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

const setUserRole = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { role } = req.body;

    try {
        if (!role || !['recruiter', 'talent'].includes(role)) {
            throw new ApiError(
                HttpStatus.BAD_REQUEST,
                'Invalid or missing role',
                ErrorCodes.VALIDATION_ERROR
            );
        }
    
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    
        const userDetails = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role
        };
        
        sendSuccessResponse(
            res, 
            { 
                user: userDetails 
            }, 
            'Role updated', 
            HttpStatus.OK
        );
    } catch (err) {
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to saved user role',
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
    }
};

export { getCurrentUser, setUserRole };
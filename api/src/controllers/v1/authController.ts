/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { hash, compare } from 'bcryptjs'

/**
 * custom modules
 */
import config from '@/config'
import { logger } from '@/lib/winston'
import { prisma } from '@/lib/prisma'
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '@/lib/jwt'
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


const register = async (req: Request, res: Response): Promise<void> => {
    const data = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existingUser) {
        throw new ApiError(
            HttpStatus.CONFLICT,
            'User with this email already exists',
            ErrorCodes.CONFLICT
        )
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Create user with role-specific data
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            hashedPassword,
            phoneNo: data.phoneNo,
            image: data.image,
            role: data.role || 'talent',
        }
    })

    // Generate access token and refresh token for the user
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token in db
    await prisma.token.upsert({
        where: {
            userId: user.id
        },
        create: {
            userId: user.id,
            refreshToken
        },
        update: {
            refreshToken
        }
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    })

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
            user: userDetails,
            accessToken
        },
        'User registered successfully',
        HttpStatus.CREATED
    )

    logger.info('User registered successfully', userDetails)
}


const login = async (req: Request, res: Response): Promise<void> => {
    const data = req.body

    const user = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (user) {
        const match = await compare(data.password, user.hashedPassword)

        if (match) {
            // Generate access token and refresh token for the user
            const accessToken = generateAccessToken(user.id)
            const refreshToken = generateRefreshToken(user.id)

            // Store refresh token in db
            await prisma.token.upsert({
                where: {
                    userId: user.id
                },
                create: {
                    userId: user.id,
                    refreshToken
                },
                update: {
                    refreshToken
                }
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: config.NODE_ENV === 'production',
                sameSite: 'strict'
            })

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
                    user: userDetails,
                    accessToken
                },
                'Login successful',
                HttpStatus.OK
            )

            logger.info('Login successful', { userDetails })
            return
        }
    }

    throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Incorrect login credentials',
        ErrorCodes.UNAUTHORIZED
    )
}


const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string

    const tokenExists = await prisma.token.findFirst({
        where: {
            refreshToken
        }
    })

    if (!tokenExists?.refreshToken) {
        throw new ApiError(
            HttpStatus.UNAUTHORIZED,
            'Invalid refresh token',
            ErrorCodes.UNAUTHORIZED
        )
    }

    const jwtPayload = verifyRefreshToken(tokenExists.refreshToken) as { userId: string }

    const accessToken = generateAccessToken(jwtPayload.userId)

    sendSuccessResponse(
        res,
        {
            accessToken
        },
        'Token refreshed',
        HttpStatus.OK
    )
}


const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string

    if (refreshToken) {
        await prisma.token.delete({
            where: {
                userId: req.userId,
                refreshToken
            }
        })

        logger.info('User refresh token deleted', {
            userId: req.userId,
            token: refreshToken
        })
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict'
    })

    res.sendStatus(204)

    logger.info('User logged out', {
        userId: req.userId
    })
}

export {
    register,
    login,
    refreshToken,
    logout
}
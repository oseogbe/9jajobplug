/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import jwt from 'jsonwebtoken'

/**
 * custom modules
 */
import config from '@/config'

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi'
    })
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY,
        subject: 'refreshToken'
    })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET)
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET)
}
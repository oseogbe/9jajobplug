/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { body, cookie, ValidationChain } from 'express-validator'

export const registerValidationChain: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        ),

    body('phoneNo')
        .optional()
        .trim()
        .custom((value: string[]) => {
            if (!value.every((phone) => /^\+?[1-9]\d{1,14}$/.test(phone))) {
                throw new Error('Invalid phone number')
            }
            return true
        }),

    body('dateOfBirth')
        .optional()
        .trim()
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            const date = new Date(value)
            const now = new Date()
            const age = now.getFullYear() - date.getFullYear()
            if (age < 18) {
                throw new Error('Must be at least 18 years old')
            }
            return true
        }),
]

export const loginValidatonChain: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
]

export const refreshTokenValidationChain: ValidationChain = cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token')
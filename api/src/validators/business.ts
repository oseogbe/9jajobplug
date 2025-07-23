/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

import { body, ValidationChain } from 'express-validator'

export const createBusinessValidationChain: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Enter a valid business name'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Enter a valid location'),

  body('website')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Enter a valid website'),
]

export const updateBusinessValidationChain: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Enter a valid business name'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Enter a valid location'),

  body('website')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Enter a valid website'),
] 
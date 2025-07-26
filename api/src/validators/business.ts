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

  body('tagline')
    .optional()
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('Tagline must be between 8 and 50 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Industry must be between 2 and 100 characters'),

  body('organizationSize')
    .notEmpty()
    .withMessage('Organization size is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Organization size must be between 2 and 50 characters'),

  body('organizationType')
    .notEmpty()
    .withMessage('Organization type is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Organization type must be between 2 and 50 characters'),

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

  body('tagline')
    .optional()
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage('Tagline must be between 8 and 50 characters'),

  body('industry')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Industry must be between 2 and 100 characters'),

  body('organizationSize')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Organization size must be between 2 and 50 characters'),

  body('organizationType')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Organization type must be between 2 and 50 characters'),

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
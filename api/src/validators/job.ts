/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

import { body, ValidationChain } from 'express-validator'

export const createJobValidationChain: ValidationChain[] = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Job title must be between 2 and 100 characters'),

    body('businessId')
        .notEmpty()
        .withMessage('Business ID is required')
        .isMongoId()
        .withMessage('Invalid Business ID'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Job category is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Job category must be between 2 and 50 characters'),

    body('workMode')
        .trim()
        .notEmpty()
        .withMessage('Work mode is required')
        .isIn(['Remote', 'On-site', 'Hybrid'])
        .withMessage('Invalid work mode'),

    body('location')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Location must be between 2 and 100 characters'),

    body('level')
        .trim()
        .notEmpty()
        .withMessage('Job level is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Job level must be between 2 and 50 characters'),

    body('jobType')
        .trim()
        .notEmpty()
        .withMessage('Job type is required')
        .isIn(['fulltime', 'parttime', 'contract', 'temporary', 'freelance', 'internship', 'volunteer'])
        .withMessage('Invalid job type'),

    body('isPaid')
        .notEmpty()
        .withMessage('Payment status is required')
        .isBoolean()
        .withMessage('Invalid payment status'),

    body('salary')
        .optional()
        .isNumeric()
        .withMessage('Salary must be a number')
        .custom((value, { req }) => {
            if (req.body.isPaid === 'true' && !value) {
                throw new Error('Salary is required for paid jobs');
            }
            return true;
        }),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Job description is required')
        .isLength({ max: 50000 })
        .withMessage('Job description must be at most 50000 characters'),
];


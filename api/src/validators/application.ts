/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { body, ValidationChain } from 'express-validator'

export const createApplicationValidationChain: ValidationChain[] = [
    body('resumeId')
        .notEmpty()
        .withMessage('Resume ID is required')
        .isString()
        .withMessage('Resume ID must be a string'),
];

export const changeApplicationStatusValidationChain: ValidationChain[] = [
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isString()
        .withMessage('Status must be a string')
        .isIn(['approved', 'rejected'])
        .withMessage('Invalid status value')
];

/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import * as express from 'express'

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}
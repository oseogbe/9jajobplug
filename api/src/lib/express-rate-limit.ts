/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60000,    // 1-minute time window for request limiting
    limit: 60,  // allow a maximum of 60 requests per window per IP
    standardHeaders: 'draft-8', // use the latest standard rate-limit headers
    legacyHeaders: false,   // disable deprecated X-RateLimit headers
    message: {
        error: 'You have sent too many requests in a given amount of time. Please try again later.'
    }
})

export default limiter
/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Router } from "express"

const router = Router()


/**
 * routes
 */
import authRoutes from "@/routes/v1/authRoute"

/**
 * root route
 */
router.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: '',
        timestamp: new Date().toISOString()
    })
})

router.use('/auth', authRoutes)

export default router
/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import { Router } from 'express'

/**
 * controllers
 */
import { 
    getCurrentUser
} from '@/controllers/v1/userController'

/**
 * middlewares
 */
import authenticate from '@/middlewares/authenticate'
import authorize from '@/middlewares/authorize'


/**
 * routes
 */
const router = Router()

router.post(
    '/current', 
    authenticate, 
    authorize(['recruiter', 'talent']), 
    getCurrentUser
)

export default router
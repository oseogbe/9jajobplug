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
    getCurrentUser,
    setUserRole
} from '@/controllers/v1/userController'

/**
 * middlewares
 */
import authenticate from '@/middlewares/authenticate'

/**
 * routes
 */
const router = Router()

router.post(
    '/current', 
    authenticate, 
    getCurrentUser
)

router.patch(
    '/role',
    authenticate,
    setUserRole
)

export default router
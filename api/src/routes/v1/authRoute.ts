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
    register, 
    login, 
    refreshToken, 
    logout 
} from '@/controllers/v1/authController'

/**
 * middlewares
 */
import validate from '@/middlewares/validate'
import authenticate from '@/middlewares/authenticate'

/**
 * validation chains
 */
import { 
    loginValidatonChain, 
    refreshTokenValidationChain, 
    registerValidationChain 
} from '@/validators/auth'

/**
 * routes
 */
const router = Router()

router.post('/register', registerValidationChain, validate, register)
router.post('/login', loginValidatonChain, validate, login)
router.post('/refresh-token', refreshTokenValidationChain, validate, refreshToken)
router.post('/logout', authenticate, logout)

export default router
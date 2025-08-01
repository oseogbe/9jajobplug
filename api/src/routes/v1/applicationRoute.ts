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
    sendApplication,
    viewApplication,
    changeApplicationStatus
} from "@/controllers/v1/applicationController"

/**
 * middlewares
 */
import validate from '@/middlewares/validate'
import authenticate from '@/middlewares/authenticate'
import authorize from '@/middlewares/authorize'

/**
 * validation chains
 */
import { createApplicationValidationChain, changeApplicationStatusValidationChain } from '@/validators/application'

/**
 * routes
 */
const router = Router()


router.post(
    '/:jobId/apply',
    authenticate,
    authorize(['talent']),
    createApplicationValidationChain,
    validate,
    sendApplication
)

router.get(
    '/:applicationId/view',
    authenticate,
    authorize(['recruiter', 'talent']),
    viewApplication
)

router.post(
    '/:applicationId/change-status',
    authenticate,
    authorize(['recruiter']),
    changeApplicationStatusValidationChain,
    validate,
    changeApplicationStatus
)

export default router

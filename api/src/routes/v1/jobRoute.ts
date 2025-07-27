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
    postJob,
    getPostedJobs,
    getJobApplicants,
    changeJobVisibility,
    deleteJob,
    getRecruiterJobs
} from "@/controllers/v1/jobController"

/**
 * middlewares
 */
import validate from '@/middlewares/validate'
import authenticate from '@/middlewares/authenticate'
import authorize from '@/middlewares/authorize'

/**
 * validation chains
*/
import { createJobValidationChain } from '@/validators/job'

/**
 * routes
 */
const router = Router()

router.post(
    '/post',
    authenticate,
    authorize(['recruiter']),
    createJobValidationChain,
    validate,
    postJob
)
router.get(
    '/list',
    authenticate,
    authorize(['recruiter']),
    getPostedJobs
)
router.get('/:jobId/applicants',
    authenticate,
    authorize(['recruiter']),
    getJobApplicants
)
router.post('/:jobId/change-visibility',
    authenticate,
    authorize(['recruiter']),
    changeJobVisibility
)
router.post('/:jobId/delete-job',
    authenticate,
    authorize(['recruiter']),
    deleteJob
)
router.get(
    '/recruiter-jobs',
    authenticate,
    authorize(['recruiter']),
    getRecruiterJobs
);

export default router

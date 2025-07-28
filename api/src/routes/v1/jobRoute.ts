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
    getJobApplicants,
    changeJobVisibility,
    deleteJob,
    getRecruiterJobs,
    getAllJobs,
    getJobBySlug,
    getRelatedJobs
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
    '/all',
    getAllJobs
)

router.get(
    '/recruiter-jobs',
    authenticate,
    authorize(['recruiter']),
    getRecruiterJobs
)

router.get('/single/:slug', getJobBySlug)

router.get('/related', getRelatedJobs)

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

export default router

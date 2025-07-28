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
    getTalentResumes,
    setDefaultResume,
    uploadResume,
    deleteResume,
} from '@/controllers/v1/talentController'

/**
 * middlewares
 */
import authenticate from '@/middlewares/authenticate'
import authorize from '@/middlewares/authorize'
import { uploadPDF } from '@/middlewares/uploadFile'

/**
 * routes
 */
const router = Router()

router.post(
    '/resume/all',
    authenticate,
    authorize(['talent']),
    getTalentResumes
)

router.post(
    '/resume/:resumeId/set-default',
    authenticate,
    authorize(['talent']),
    setDefaultResume
)

router.post(
    '/resume/upload',
    authenticate,
    authorize(['talent']),
    uploadPDF.single('resume'),
    uploadResume
)

router.post('/resume/:resumeId/delete',
    authenticate,
    authorize(['talent']),
    deleteResume
)

export default router
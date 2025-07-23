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
    createBusiness,
    updateBusiness,
    deleteBusiness
} from "@/controllers/v1/businessController"

/**
 * middlewares
 */
import validate from '@/middlewares/validate'
import authenticate from '@/middlewares/authenticate'
import authorize from '@/middlewares/authorize'
import upload, { processImage } from '@/middlewares/uploadImage'

/**
 * validation chains
 */
import { createBusinessValidationChain, updateBusinessValidationChain } from '@/validators/business'

/**
 * routes
 */
const router = Router()

router.post('/create', 
    authenticate, 
    authorize(['recruiter']),
    upload.single('logo'),
    processImage,
    createBusinessValidationChain, 
    validate, 
    createBusiness
)

router.put('/:businessId/update', 
    authenticate, 
    authorize(['recruiter']), 
    upload.single('logo'),
    processImage,
    updateBusinessValidationChain, 
    validate, 
    updateBusiness
)

router.delete('/:businessId/delete', 
    authenticate, 
    authorize(['recruiter']), 
    deleteBusiness
)

export default router

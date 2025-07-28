/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */


/**
 * custom modules
 */
import { logger } from '@/lib/winston'
import { prisma } from '@/lib/prisma'
import {
    ApiError,
    HttpStatus,
    ErrorCodes,
    sendSuccessResponse
} from '@/utils/apiResponse'
import { storageService } from '@/services/storageService';
import { slugify } from '@/utils'

/**
 * types
 */
import type { Request, Response } from 'express'

const createBusiness = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId as string
    const { name, tagline, industry, organizationSize, organizationType, email, description, location, website } = req.body
    const slug = slugify(name)

    let logoUrl: string | undefined = undefined
    let logoPublicId: string | undefined = undefined
    if (req.file) {
        const result = await storageService.uploadImage(req.file.buffer, { folder: 'business_logos' })
        logoUrl = result.url
        logoPublicId = result.publicId
    }

    try {
        const business = await prisma.business.create({
            data: {
                name,
                tagline,
                industry,
                organizationSize,
                organizationType,
                email,
                logo: logoUrl,
                logoPublicId,
                description,
                location,
                website,
                recruiterId,
                slug,
            },
        })
        sendSuccessResponse(res, { business }, 'Business created successfully', HttpStatus.CREATED)
        logger.info('Business created', { recruiterId, businessId: business.id })
    } catch (error) {
        logger.error('Error creating business', { error })
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to create business',
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
    }
}

const updateBusiness = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId
    const { businessId } = req.params
    const { name, tagline, industry, organizationSize, organizationType, email, description, location, website } = req.body

    try {
        const business = await prisma.business.findUnique({ where: { id: businessId } })

        if (!business) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Business not found', ErrorCodes.NOT_FOUND)
        }

        if (business.recruiterId !== recruiterId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to update this business', ErrorCodes.FORBIDDEN)
        }

        let logoUrl: string | undefined = undefined;
        let logoPublicId: string | undefined = undefined;
        if (req.file) {
            const result = await storageService.uploadImage(req.file.buffer, { folder: 'business_logos' });
            logoUrl = result.url
            logoPublicId = result.publicId
        }

        // If name is being updated, regenerate slug
        let slugUpdate = {};
        if (name && name !== business.name) {
            slugUpdate = { slug: slugify(name) }
        }
        const updatedBusiness = await prisma.business.update({
            where: { id: businessId },
            data: {
                name,
                tagline,
                industry,
                organizationSize,
                organizationType,
                email,
                logo: logoUrl,
                logoPublicId,
                description,
                location,
                website,
                updatedAt: new Date(),
                ...slugUpdate
            },
        })
        sendSuccessResponse(res, { business: updatedBusiness }, 'Business updated successfully', HttpStatus.OK)
        logger.info('Business updated', { recruiterId, businessId })
    } catch (error) {
        logger.error('Error updating business', { error })
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update business',
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
    }
}

const deleteBusiness = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId
    const { businessId } = req.params

    try {
        const business = await prisma.business.findUnique({ where: { id: businessId }, include: { jobs: true } })
        if (!business) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Business not found', ErrorCodes.NOT_FOUND)
        }
        if (business.recruiterId !== recruiterId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to delete this business', ErrorCodes.FORBIDDEN)
        }
        // Delete logo from storage if it exists
        if (business.logoPublicId) {
            try {
                await storageService.delete(business.logoPublicId);
            } catch (err) {
                logger.warn('Failed to delete business logo from storage', { error: err, businessId });
            }
        }
        // Delete all jobs associated with the business
        await prisma.job.deleteMany({ where: { businessId } })
        // Delete the business
        await prisma.business.delete({ where: { id: businessId } })
        sendSuccessResponse(res, {}, 'Business and associated jobs deleted successfully', HttpStatus.OK)
        logger.info('Business deleted', { recruiterId, businessId })
    } catch (error) {
        logger.error('Error deleting business', { error })
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete business',
            ErrorCodes.INTERNAL_SERVER_ERROR
        )
    }
}

const getRecruiterBusinesses = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId as string;
    try {
        const businesses = await prisma.business.findMany({
            where: { recruiterId },
            orderBy: { createdAt: 'desc' },
        });
        sendSuccessResponse(res, { businesses }, 'Businesses fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching recruiter businesses', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch businesses',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

export {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    getRecruiterBusinesses
}
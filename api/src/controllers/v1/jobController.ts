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

/**
 * types
 */
import type { Request, Response } from 'express'

const postJob = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId as string;
    const { title, description, category, location, level, salary, jobType, businessId, workMode, isPaid } = req.body;

    // Validate business ownership
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Business not found', ErrorCodes.NOT_FOUND);
    }
    if (business.recruiterId !== recruiterId) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to post jobs for this business', ErrorCodes.FORBIDDEN);
    }

    try {
        const job = await prisma.job.create({
            data: {
                title,
                description,
                category,
                location,
                level,
                salary: Number(salary),
                type: jobType,
                businessId,
                workMode,
                isPaid,
            },
        });
        sendSuccessResponse(res, { job }, 'Job posted successfully', HttpStatus.CREATED);
        logger.info('Job posted', { recruiterId, jobId: job.id, businessId });
    } catch (error) {
        logger.error('Error posting job', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to post job',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const getPostedJobs = async (req: Request, res: Response): Promise<void> => {

}

const getJobApplicants = async (req: Request, res: Response): Promise<void> => {

}

const changeJobVisibility = async (req: Request, res: Response): Promise<void> => {

}

const deleteJob = async (req: Request, res: Response): Promise<void> => {

}

export {
    postJob,
    getJobApplicants,
    getPostedJobs,
    changeJobVisibility,
    deleteJob
}
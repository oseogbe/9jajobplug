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

const sendApplication = async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;
    const { resumeId } = req.body;
    const userId = req.userId as string;

    try {
        // Check if the job exists
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Job not found', ErrorCodes.NOT_FOUND);
        }

        // Ensure the job status is open
        if (job.status !== 'open') {
            throw new ApiError(HttpStatus.FORBIDDEN, 'Job is not open for applications', ErrorCodes.FORBIDDEN);
        }

        // Ensure the deadline has not passed
        if (job.deadline && new Date(job.deadline) < new Date()) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'Application deadline has passed', ErrorCodes.FORBIDDEN);
        }

        // Check if the resume exists and belongs to the user
        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume || resume.userId !== userId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'Invalid resume selection', ErrorCodes.FORBIDDEN);
        }

        // Create the application
        const application = await prisma.application.create({
            data: {
                businessId: job.businessId,
                jobId,
                talentId: userId,
                resumeId,
            },
        });

        sendSuccessResponse(res, { application }, 'Application submitted successfully', HttpStatus.CREATED);
    } catch (error) {
        logger.error('Error submitting application', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to submit application',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const viewApplication = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const userId = req.userId as string;

    try {
        // Fetch the application details
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                job: {
                    include: {
                        business: true,
                    },
                },
                resume: true,
            },
        });

        if (!application) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Application not found', ErrorCodes.NOT_FOUND);
        }

        // Ensure the user is authorized to view the application
        if (application.talentId !== userId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to view this application', ErrorCodes.FORBIDDEN);
        }

        // Ensure the recruiter who posted the job is authorized to view the application
        if (application.job.business.recruiterId !== userId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to view this application', ErrorCodes.FORBIDDEN);
        }

        sendSuccessResponse(res, { application }, 'Application details retrieved successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error retrieving application', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to retrieve application',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const changeApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const { status } = req.body;

    try {
        // Update the application status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        sendSuccessResponse(res, { updatedApplication }, 'Application status updated successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error updating application status', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update application status',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

export {
    sendApplication,
    viewApplication,
    changeApplicationStatus,
}
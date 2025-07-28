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
import { slugify } from '@/utils'
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
    const slug = slugify(title);

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
                slug,
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

const getAllJobs = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    try {
        const jobs = await prisma.job.findMany({
            skip,
            take: Number(limit),
            include: {
                business: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        website: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalJobs = await prisma.job.count();

        sendSuccessResponse(res, {
            jobs,
            total: totalJobs,
            page: Number(page),
            limit: Number(limit),
        }, 'Jobs fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching jobs', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch jobs',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const getRecruiterJobs = async (req: Request, res: Response): Promise<void> => {
    const recruiterId = req.userId as string;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    try {
        const jobs = await prisma.job.findMany({
            where: {
                business: {
                    recruiterId,
                },
            },
            skip,
            take: Number(limit),
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalJobs = await prisma.job.count({
            where: {
                business: {
                    recruiterId,
                },
            },
        });

        sendSuccessResponse(res, {
            jobs,
            total: totalJobs,
            page: Number(page),
            limit: Number(limit),
        }, 'Jobs fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching recruiter jobs', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch jobs',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const getJobBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    try {
        const job = await prisma.job.findUnique({
            where: { slug },
            include: {
                business: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true,
                        website: true,
                    },
                },
            },
        });

        if (!job) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Job not found', ErrorCodes.NOT_FOUND);
        }

        const tailoredJob = {
            id: job.id,
            title: job.title,
            description: job.description,
            category: job.category,
            location: job.location,
            level: job.level,
            salary: job.salary,
            type: job.type,
            workMode: job.workMode,
            isPaid: job.isPaid,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            business: job.business,
        };

        sendSuccessResponse(res, { job: tailoredJob }, 'Job fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching job by slug', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch job',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const getRelatedJobs = async (req: Request, res: Response): Promise<void> => {
    const { businessId, excludeSlug } = req.query;

    try {
        const relatedJobs = await prisma.job.findMany({
            where: {
                businessId: String(businessId),
                slug: {
                    not: String(excludeSlug),
                },
            },
            take: 4, // Limit to 4 related jobs
            orderBy: {
                createdAt: 'desc',
            },
        });

        sendSuccessResponse(res, { jobs: relatedJobs }, 'Related jobs fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching related jobs', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch related jobs',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const getJobApplicants = async (req: Request, res: Response): Promise<void> => {

}

const changeJobVisibility = async (req: Request, res: Response): Promise<void> => {

}

const deleteJob = async (req: Request, res: Response): Promise<void> => {

}

export {
    postJob,
    getRecruiterJobs,
    getAllJobs,
    getJobBySlug,
    getRelatedJobs,
    getJobApplicants,
    changeJobVisibility,
    deleteJob,
}
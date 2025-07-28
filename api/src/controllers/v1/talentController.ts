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

/**
 * types
 */
import type { Request, Response } from 'express'

const getTalentResumes = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId as string;

    try {
        const resumes = await prisma.resume.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        sendSuccessResponse(res, { resumes }, 'Resumes fetched successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error fetching resumes', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch resumes',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const setDefaultResume = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId as string;
    const { resumeId } = req.params;

    try {
        // Reset all resumes to not default
        await prisma.resume.updateMany({
            where: { userId },
            data: { isDefault: false },
        });

        // Set the selected resume as default
        const updatedResume = await prisma.resume.update({
            where: { id: resumeId },
            data: { isDefault: true },
        });

        sendSuccessResponse(res, { resume: updatedResume }, 'Default resume set successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error setting default resume', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to set default resume',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const uploadResume = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId as string;

    if (!req.file) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'No file uploaded', ErrorCodes.VALIDATION_ERROR);
    }

    try {
        // Reset all resumes to not default
        await prisma.resume.updateMany({
            where: { userId },
            data: { isDefault: false },
        });

        const result = await storageService.upload(req.file.buffer, { folder: 'resumes' });

        const resume = await prisma.resume.create({
            data: {
                userId,
                fileUrl: result.url,
                filePublicId: result.publicId!,
                isDefault: true,
            },
        });

        sendSuccessResponse(res, { resume }, 'Resume uploaded successfully', HttpStatus.CREATED);
    } catch (error) {
        logger.error('Error uploading resume', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to upload resume',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteResume = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId as string;
    const { resumeId } = req.params;

    try {
        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });

        if (!resume || resume.userId !== userId) {
            throw new ApiError(HttpStatus.FORBIDDEN, 'Unauthorized to delete this resume', ErrorCodes.FORBIDDEN);
        }

        if (resume.filePublicId) {
            await storageService.delete(resume.filePublicId);
        }

        // Delete logo from storage if it exists
        if (resume.filePublicId) {
            try {
                await storageService.delete(resume.filePublicId);
            } catch (err) {
                logger.warn('Failed to delete resume file from storage', { error: err, resumeId });
            }
        }

        await prisma.resume.delete({ where: { id: resumeId } });

        sendSuccessResponse(res, {}, 'Resume deleted successfully', HttpStatus.OK);
    } catch (error) {
        logger.error('Error deleting resume', { error });
        throw new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete resume',
            ErrorCodes.INTERNAL_SERVER_ERROR
        );
    }
};

export {
    getTalentResumes,
    setDefaultResume,
    uploadResume,
    deleteResume,
};


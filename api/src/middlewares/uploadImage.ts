/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import multer from 'multer'
import sharp from 'sharp'
import { Request, Response, NextFunction } from 'express'
import { ApiError, HttpStatus, ErrorCodes } from '@/utils/apiResponse'

// Configure multer for memory storage
const storage = multer.memoryStorage()

// File filter to only allow images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new ApiError(
            HttpStatus.BAD_REQUEST,
            'Only image files are allowed',
            ErrorCodes.VALIDATION_ERROR
        ))
    }
}

// Configure multer upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
})

/**
 * Middleware to process uploaded image
 * Resizes and optimizes the image before saving
 */
export const processImage = async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.file) {
        return next()
    }

    try {
        // Process image with sharp
        const processedImage = await sharp(req.file.buffer)
            .resize(800, 800, { // Max dimensions
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer()

        // Replace original buffer with processed image
        req.file.buffer = processedImage
        req.file.mimetype = 'image/jpeg'

        next()
    } catch (error) {
        next(new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Error processing image',
            ErrorCodes.INTERNAL_SERVER_ERROR
        ))
    }
}

export default upload 
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

/**
 * custom modules
 */
import { ApiError, HttpStatus, ErrorCodes } from '@/utils/apiResponse'

// Configure multer for memory storage
const storage = multer.memoryStorage()

// Image filter to only allow images
const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

/**
 * Middleware to process uploaded image
 * Resizes and optimizes the image before saving
 */
const processImage = async (req: Request, _res: Response, next: NextFunction) => {
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

// Configure multer upload for images
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
})

// PDF filter to only allow images
const pdfFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(new ApiError(
            HttpStatus.BAD_REQUEST,
            'Only PDF files are allowed',
            ErrorCodes.VALIDATION_ERROR
        ))
    }
}

// Configure multer upload for PDFs
const uploadPDF = multer({
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 1 * 1024 * 1024, // 1MB limit
    }
})

export {
    uploadImage,
    uploadPDF,
    processImage
}
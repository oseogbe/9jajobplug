/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

import { v2 as cloudinary } from 'cloudinary';

import config from '@/config';
import { IStorageProvider, UploadResult } from '@/typings';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryProvider implements IStorageProvider {
    async upload(buffer: Buffer, options?: { folder?: string; filename?: string }): Promise<UploadResult> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: options?.folder,
                    public_id: options?.filename,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('No result from Cloudinary'));
                    resolve({ url: result.secure_url, publicId: result.public_id });
                }
            );
            uploadStream.end(buffer);
        });
    }

    async delete(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
}

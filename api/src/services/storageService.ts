/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

import { IStorageProvider } from '@/typings';
import { CloudinaryProvider } from '@/providers/storage/CloudinaryProvider';
// import { S3StorageProvider } from './S3StorageProvider'; // For future use
import config from '@/config';

let provider: IStorageProvider;

switch (config.storageProvider) {
  case 'cloudinary':
    provider = new CloudinaryProvider();
    break;
  // case 's3':
  //   provider = new S3StorageProvider();
  //   break;
  default:
    provider = new CloudinaryProvider();
}

export const storageService = provider;


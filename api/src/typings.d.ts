/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

export interface UploadResult {
  url: string;
  publicId?: string;
}

export interface IStorageProvider {
  upload(buffer: Buffer, options?: { folder?: string; filename?: string }): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}

import { join } from 'node:path';

export const STORAGE_DIR = join(process.cwd(), 'uploads', 'images');
export const STORAGE_PUBLIC_PATH = '/uploads/images';
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

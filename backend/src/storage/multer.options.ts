import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname } from 'node:path';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  STORAGE_DIR,
} from './storage.constants';

/** Multer config: where files go, how they are named, type/size limits. */
export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      mkdirSync(STORAGE_DIR, { recursive: true });
      cb(null, STORAGE_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(
        new BadRequestException(
          'Only jpeg, png, webp, and gif images are allowed',
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
};

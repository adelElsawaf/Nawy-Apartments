import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STORAGE_PUBLIC_PATH } from './storage.constants';

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  /** Builds public path + absolute URL for a file Multer already saved. */
  save(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const path = `${STORAGE_PUBLIC_PATH}/${file.filename}`;
    const appUrl = (
      this.config.get<string>('APP_URL') ?? 'http://localhost:3000'
    ).replace(/\/+$/, '');

    return {
      path,
      url: `${appUrl}${path}`,
    };
  }

  getPublicUrl(path: string) {
    const appUrl = (
      this.config.get<string>('APP_URL') ?? 'http://localhost:3000'
    ).replace(/\/+$/, '');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${appUrl}${normalized}`;
  }
}

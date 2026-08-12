import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { UploadResponseDto } from './dto/response/upload-response.dto';
import { UploadMapper } from './mappers/upload.mapper';

@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}

  upload(file: Express.Multer.File): UploadResponseDto {
    const stored = this.storageService.save(file);
    return UploadMapper.toResponseDto(stored);
  }
}

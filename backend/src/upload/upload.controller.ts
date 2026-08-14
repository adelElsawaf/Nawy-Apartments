import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiUploadFile } from './documentation/apis/upload-file.api';
import { ApiUploadController } from './documentation/controllers/upload.controller.documentation';
import { ApiUploadDtos } from './documentation/dtos/upload.dtos.documentation';
import { UploadResponseDto } from './dto/response/upload-response.dto';
import { UploadService } from './upload.service';

@ApiUploadController()
@ApiUploadDtos()
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiUploadFile()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File): UploadResponseDto {
    return this.uploadService.upload(file);
  }
}

import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';

export function ApiUploadDtos() {
  return applyDecorators(ApiExtraModels(UploadResponseDto));
}

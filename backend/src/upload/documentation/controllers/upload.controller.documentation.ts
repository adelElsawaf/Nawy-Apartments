import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiUploadController() {
  return applyDecorators(ApiTags('Uploads'));
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';

export function ApiUploadFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload image',
      description:
        'Uploads a single image file and returns its stored path and public URL. Allowed: jpeg, png, webp, gif. Max size: 5MB. Field name must be `file`.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image file to upload',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'File uploaded successfully',
      type: UploadResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Missing file, unsupported type, or file too large',
    }),
  );
}

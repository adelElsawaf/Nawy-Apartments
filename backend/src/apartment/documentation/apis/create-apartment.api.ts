import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApartmentResponseDto } from '../../dto/response/apartment-response.dto';

export function ApiCreateApartment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create apartment',
      description:
        'Creates an apartment. Upload images first via POST /api/uploads, then pass the returned paths here. Unit number must be unique within the same project.',
    }),
    ApiCreatedResponse({
      description: 'Apartment created successfully',
      type: ApartmentResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed',
    }),
    ApiNotFoundResponse({
      description: 'Project not found',
    }),
    ApiConflictResponse({
      description: 'Unit number already exists in this project',
    }),
  );
}

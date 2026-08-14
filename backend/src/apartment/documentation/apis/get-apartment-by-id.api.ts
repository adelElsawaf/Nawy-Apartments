import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ApartmentResponseDto } from '../../dto/response/apartment-response.dto';

export function ApiGetApartmentById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get apartment by id',
      description:
        'Returns full apartment details including project and images.',
    }),
    ApiParam({
      name: 'id',
      description: 'Apartment id',
      example: 1,
      type: Number,
    }),
    ApiOkResponse({
      description: 'Apartment found',
      type: ApartmentResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid apartment id',
    }),
    ApiNotFoundResponse({
      description: 'Apartment not found',
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiApartmentController() {
  return applyDecorators(ApiTags('Apartments'));
}

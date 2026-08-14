import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetAllResponseDto } from '../../dto/response/get-all-response.dto';

export function ApiGetAllApartments() {
  return applyDecorators(
    ApiOperation({
      summary: 'List apartments',
      description:
        'Returns a paginated apartment list. Search matches unit name and project name. Price and area support ranges; other numeric filters are exact.',
    }),
    ApiOkResponse({
      description: 'Apartments page returned successfully',
      type: GetAllResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid query parameters',
    }),
  );
}

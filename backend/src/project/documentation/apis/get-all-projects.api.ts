import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetAllResponseDto } from '../../dto/response/get-all-response.dto';

export function ApiGetAllProjects() {
  return applyDecorators(
    ApiOperation({
      summary: 'List projects',
      description:
        'Returns a paginated list of projects. Optional case-insensitive search by name.',
    }),
    ApiOkResponse({
      description: 'Projects page returned successfully',
      type: GetAllResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid query parameters',
    }),
  );
}

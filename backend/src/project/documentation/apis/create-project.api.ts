import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProjectResponseDto } from '../../dto/response/project-response.dto';

export function ApiCreateProject() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create project',
      description: 'Creates a new project. Project names must be unique.',
    }),
    ApiCreatedResponse({
      description: 'Project created successfully',
      type: ProjectResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed',
    }),
    ApiConflictResponse({
      description: 'A project with the same name already exists',
    }),
  );
}

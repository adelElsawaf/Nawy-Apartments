import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiProjectController() {
  return applyDecorators(
    ApiTags('Projects'),
  );
}

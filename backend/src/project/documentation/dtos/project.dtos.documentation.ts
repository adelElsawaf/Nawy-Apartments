import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateProjectRequestDto } from '../../dto/request/create-project-request.dto';
import { GetAllRequestDto } from '../../dto/request/get-all-request.dto';
import { GetAllResponseDto } from '../../dto/response/get-all-response.dto';
import { ProjectResponseDto } from '../../dto/response/project-response.dto';

export function ApiProjectDtos() {
  return applyDecorators(
    ApiExtraModels(
      CreateProjectRequestDto,
      GetAllRequestDto,
      ProjectResponseDto,
      GetAllResponseDto,
    ),
  );
}

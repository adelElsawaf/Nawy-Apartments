import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiCreateProject } from './documentation/apis/create-project.api';
import { ApiGetAllProjects } from './documentation/apis/get-all-projects.api';
import { ApiProjectController } from './documentation/controllers/project.controller.documentation';
import { ApiProjectDtos } from './documentation/dtos/project.dtos.documentation';
import { CreateProjectRequestDto } from './dto/request/create-project-request.dto';
import { GetAllRequestDto } from './dto/request/get-all-request.dto';
import { GetAllResponseDto } from './dto/response/get-all-response.dto';
import { ProjectResponseDto } from './dto/response/project-response.dto';
import { ProjectService } from './project.service';

@ApiProjectController()
@ApiProjectDtos()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateProject()
  create(@Body() dto: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    return this.projectService.create(dto);
  }

  @Get()
  @ApiGetAllProjects()
  getAll(@Query() query: GetAllRequestDto): Promise<GetAllResponseDto> {
    return this.projectService.getAll(query);
  }
}

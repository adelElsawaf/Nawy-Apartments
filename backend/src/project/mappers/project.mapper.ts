import { CreateProjectRequestDto } from '../dto/request/create-project-request.dto';
import { GetAllResponseDto } from '../dto/response/get-all-response.dto';
import { ProjectResponseDto } from '../dto/response/project-response.dto';
import { Project } from '../project.entity';

export class ProjectMapper {
  static fromCreateRequest(dto: CreateProjectRequestDto): Project {
    const project = new Project();
    project.name = dto.name;
    project.description = dto.description ?? null;
    return project;
  }

  static toResponseDto(project: Project): ProjectResponseDto {
    const response = new ProjectResponseDto();
    response.id = project.id;
    response.name = project.name;
    response.description = project.description;
    response.createdAt = project.createdAt;
    return response;
  }

  static toGetAllResponseDto(
    projects: Project[],
    page: number,
    limit: number,
    hasNextPage: boolean,
  ): GetAllResponseDto {
    const response = new GetAllResponseDto();
    response.data = projects.map((project) => this.toResponseDto(project));
    response.page = page;
    response.limit = limit;
    response.hasNextPage = hasNextPage;
    return response;
  }
}

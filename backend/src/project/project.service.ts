import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { isUniqueViolation } from '../shared/exceptions/db/is-unique-violation';
import { CreateProjectRequestDto } from './dto/request/create-project-request.dto';
import { GetAllRequestDto } from './dto/request/get-all-request.dto';
import { GetAllResponseDto } from './dto/response/get-all-response.dto';
import { ProjectResponseDto } from './dto/response/project-response.dto';
import { ProjectMapper } from './mappers/project.mapper';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
  ) {}

  async create(dto: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    const project = ProjectMapper.fromCreateRequest(dto);

    try {
      const saved = await this.projects.save(project);
      return ProjectMapper.toResponseDto(saved);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `A project named "${dto.name}" already exists`,
        );
      }

      throw error;
    }
  }

  async getAll(dto: GetAllRequestDto): Promise<GetAllResponseDto> {
    const projects = await this.projects.find({
      where: dto.search ? { name: ILike(`%${dto.search}%`) } : {},
      order: { id: 'ASC' },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit + 1,
    });
  
    const hasNextPage = projects.length > dto.limit;
  
    return ProjectMapper.toGetAllResponseDto(
      projects.slice(0, dto.limit),
      dto.page,
      dto.limit,
      hasNextPage,
    );
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { ProjectService } from '../project/project.service';
import { isUniqueViolation } from '../shared/exceptions/db/is-unique-violation';
import { CreateApartmentRequestDto } from './dto/request/create-apartment-request.dto';
import { GetAllRequestDto } from './dto/request/get-all-request.dto';
import { ApartmentResponseDto } from './dto/response/apartment-response.dto';
import { GetAllResponseDto } from './dto/response/get-all-response.dto';
import { Apartment } from './entities/apartment.entity';
import { ApartmentType } from './enums/apartment-type.enum';
import { FinishingStatus } from './enums/finishing-status.enum';
import { ApartmentMapper } from './mappers/apartment.mapper';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartments: Repository<Apartment>,
    private readonly projectsService: ProjectService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateApartmentRequestDto): Promise<ApartmentResponseDto> {
    const project = dto.projectId
      ? await this.projectsService.findEntityById(dto.projectId)
      : null;
    const apartment = ApartmentMapper.fromCreateRequest(dto, project);

    try {
      const saved = await this.apartments.save(apartment);
      const appUrl =
        this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
      return ApartmentMapper.toResponseDto(saved, appUrl);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `An apartment with unit number "${dto.unitNumber}" already exists in this project`,
        );
      }

      throw error;
    }
  }

  async getById(id: number): Promise<ApartmentResponseDto> {
    const apartment = await this.apartments.findOne({
      where: { id },
      relations: { project: true, images: true },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with id "${id}" not found`);
    }

    const appUrl =
      this.config.get<string>('APP_URL') ?? 'http://localhost:3000';
    return ApartmentMapper.toResponseDto(apartment, appUrl);
  }

  async getAll(dto: GetAllRequestDto): Promise<GetAllResponseDto> {
    const query = this.createGetAllQuery();

    if (dto.search) {
      query.andWhere(
        new Brackets((qb) => {
          this.searchByUnitName(qb, dto.search);
          this.searchByProjectName(qb, dto.search);
        }),
      );
    }

    this.filterByProject(query, dto.projectId);
    this.filterByType(query, dto.type);
    this.filterByFinishingStatus(query, dto.finishingStatus);
    this.filterByPrice(query, dto.minPrice, dto.maxPrice);
    this.filterByArea(query, dto.minArea, dto.maxArea);
    this.filterByRooms(query, dto.rooms);
    this.filterByBedrooms(query, dto.bedrooms);
    this.filterByBathrooms(query, dto.bathrooms);
    this.filterByFloor(query, dto.floor);

    const apartments = await query
      .skip((dto.page - 1) * dto.limit)
      .take(dto.limit + 1)
      .getMany();

    const hasNextPage = apartments.length > dto.limit;
    const appUrl =
      this.config.get<string>('APP_URL') ?? 'http://localhost:3000';

    return ApartmentMapper.toGetAllResponseDto(
      apartments.slice(0, dto.limit),
      appUrl,
      dto.page,
      dto.limit,
      hasNextPage,
    );
  }

  private createGetAllQuery(): SelectQueryBuilder<Apartment> {
    return this.apartments
      .createQueryBuilder('apartment')
      .leftJoin('apartment.project', 'project')
      .setFindOptions({
        relations: {
          project: true,
          images: true,
        },
        relationLoadStrategy: 'query',
      })
      .orderBy('apartment.createdAt', 'DESC')
      .addOrderBy('apartment.id', 'DESC');
  }

  private searchByUnitName(qb: WhereExpressionBuilder, search?: string) {
    if (!search) {
      return;
    }

    qb.orWhere('apartment.unitName ILIKE :search', {
      search: `%${search}%`,
    });
  }

  private searchByProjectName(qb: WhereExpressionBuilder, search?: string) {
    if (!search) {
      return;
    }

    qb.orWhere('project.name ILIKE :search', {
      search: `%${search}%`,
    });
  }

  private filterByProject(
    query: SelectQueryBuilder<Apartment>,
    projectId?: number,
  ) {
    if (projectId == null) {
      return;
    }

    query.andWhere('project.id = :projectId', { projectId });
  }

  private filterByType(
    query: SelectQueryBuilder<Apartment>,
    type?: ApartmentType,
  ) {
    if (!type) {
      return;
    }

    query.andWhere('apartment.type = :type', { type });
  }

  private filterByFinishingStatus(
    query: SelectQueryBuilder<Apartment>,
    finishingStatus?: FinishingStatus,
  ) {
    if (!finishingStatus) {
      return;
    }

    query.andWhere('apartment.finishingStatus = :finishingStatus', {
      finishingStatus,
    });
  }

  private filterByPrice(
    query: SelectQueryBuilder<Apartment>,
    minPrice?: number,
    maxPrice?: number,
  ) {
    if (minPrice != null) {
      query.andWhere('apartment.price >= :minPrice', { minPrice });
    }

    if (maxPrice != null) {
      query.andWhere('apartment.price <= :maxPrice', { maxPrice });
    }
  }

  private filterByArea(
    query: SelectQueryBuilder<Apartment>,
    minArea?: number,
    maxArea?: number,
  ) {
    if (minArea != null) {
      query.andWhere('apartment.area >= :minArea', { minArea });
    }

    if (maxArea != null) {
      query.andWhere('apartment.area <= :maxArea', { maxArea });
    }
  }

  private filterByRooms(
    query: SelectQueryBuilder<Apartment>,
    rooms?: number,
  ) {
    if (rooms == null) {
      return;
    }

    query.andWhere('apartment.rooms = :rooms', { rooms });
  }

  private filterByBedrooms(
    query: SelectQueryBuilder<Apartment>,
    bedrooms?: number,
  ) {
    if (bedrooms == null) {
      return;
    }

    query.andWhere('apartment.bedrooms = :bedrooms', { bedrooms });
  }

  private filterByBathrooms(
    query: SelectQueryBuilder<Apartment>,
    bathrooms?: number,
  ) {
    if (bathrooms == null) {
      return;
    }

    query.andWhere('apartment.bathrooms = :bathrooms', { bathrooms });
  }

  private filterByFloor(
    query: SelectQueryBuilder<Apartment>,
    floor?: number,
  ) {
    if (floor == null) {
      return;
    }

    query.andWhere('apartment.floor = :floor', { floor });
  }
}

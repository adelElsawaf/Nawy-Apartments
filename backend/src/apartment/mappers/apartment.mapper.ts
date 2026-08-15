import { ProjectResponseDto } from '../../project/dto/response/project-response.dto';
import { ProjectMapper } from '../../project/mappers/project.mapper';
import { Project } from '../../project/project.entity';
import { CreateApartmentRequestDto } from '../dto/request/create-apartment-request.dto';
import { ApartmentImageResponseDto } from '../dto/response/apartment-image-response.dto';
import { GetAllItemResponseDto } from '../dto/response/get-all-item-response.dto';
import { GetAllResponseDto } from '../dto/response/get-all-response.dto';
import { ApartmentResponseDto } from '../dto/response/apartment-response.dto';
import { ApartmentImage } from '../entities/apartment-image.entity';
import { Apartment } from '../entities/apartment.entity';
import { ApartmentImageType } from '../enums/apartment-image-type.enum';

export class ApartmentMapper {
  static fromCreateRequest(
    dto: CreateApartmentRequestDto,
    project: Project | null,
  ): Apartment {
    const apartment = new Apartment();
    apartment.unitName = dto.unitName;
    apartment.unitNumber = dto.unitNumber;
    apartment.type = dto.type;
    apartment.description = dto.description ?? null;
    apartment.price = dto.price.toFixed(2);
    apartment.area = dto.area.toFixed(2);
    apartment.rooms = dto.rooms;
    apartment.bedrooms = dto.bedrooms;
    apartment.bathrooms = dto.bathrooms;
    apartment.floor = dto.floor ?? null;
    apartment.finishingStatus = dto.finishingStatus;
    apartment.project = project;
    apartment.images = (dto.images ?? []).map((item) => {
      const image = new ApartmentImage();
      image.path = item.path;
      image.type = item.type;
      return image;
    });

    return apartment;
  }

  static toResponseDto(
    apartment: Apartment,
    appUrl: string,
  ): ApartmentResponseDto {
    const response = new ApartmentResponseDto();
    response.id = apartment.id;
    response.unitName = apartment.unitName;
    response.unitNumber = apartment.unitNumber;
    response.type = apartment.type;
    response.project = this.toProjectResponseDto(apartment.project);
    response.description = apartment.description;
    response.price = apartment.price;
    response.area = apartment.area;
    response.rooms = apartment.rooms;
    response.bedrooms = apartment.bedrooms;
    response.bathrooms = apartment.bathrooms;
    response.floor = apartment.floor;
    response.finishingStatus = apartment.finishingStatus;
    response.images = (apartment.images ?? []).map((image) =>
      this.toImageResponseDto(image, appUrl),
    );
    response.createdAt = apartment.createdAt;
    return response;
  }

  static toGetAllResponseDto(
    apartments: Apartment[],
    appUrl: string,
    page: number,
    limit: number,
    hasNextPage: boolean,
  ): GetAllResponseDto {
    const response = new GetAllResponseDto();
    response.data = apartments.map((apartment) =>
      this.toGetAllItemResponseDto(apartment, appUrl),
    );
    response.page = page;
    response.limit = limit;
    response.hasNextPage = hasNextPage;
    return response;
  }

  private static toGetAllItemResponseDto(
    apartment: Apartment,
    appUrl: string,
  ): GetAllItemResponseDto {
    const hero = (apartment.images ?? []).find(
      (image) => image.type === ApartmentImageType.Hero,
    );

    const response = new GetAllItemResponseDto();
    response.id = apartment.id;
    response.unitName = apartment.unitName;
    response.unitNumber = apartment.unitNumber;
    response.type = apartment.type;
    response.price = apartment.price;
    response.area = apartment.area;
    response.bedrooms = apartment.bedrooms;
    response.bathrooms = apartment.bathrooms;
    response.project = this.toProjectResponseDto(apartment.project);
    response.imageUrl = hero ? this.toPublicUrl(hero.path, appUrl) : null;
    return response;
  }

  private static toProjectResponseDto(
    project: Project | null | undefined,
  ): ProjectResponseDto | null {
    if (!project) {
      return null;
    }

    return ProjectMapper.toResponseDto(project);
  }

  private static toImageResponseDto(
    image: ApartmentImage,
    appUrl: string,
  ): ApartmentImageResponseDto {
    const response = new ApartmentImageResponseDto();
    response.id = image.id;
    response.path = image.path;
    response.type = image.type;
    response.createdAt = image.createdAt;
    response.url = this.toPublicUrl(image.path, appUrl);
    return response;
  }

  private static toPublicUrl(path: string, appUrl: string): string {
    const base = appUrl.replace(/\/+$/, '');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized}`;
  }
}

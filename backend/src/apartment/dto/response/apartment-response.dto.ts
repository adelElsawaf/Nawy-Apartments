import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from '../../../project/dto/response/project-response.dto';
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';
import { ApartmentImageResponseDto } from './apartment-image-response.dto';

export class ApartmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sky Villa A' })
  unitName: string;

  @ApiProperty({ example: 'A-12' })
  unitNumber: string;

  @ApiProperty({ enum: ApartmentType, example: ApartmentType.Apartment })
  type: ApartmentType;

  @ApiProperty({ type: ProjectResponseDto, nullable: true })
  project: ProjectResponseDto | null;

  @ApiProperty({
    example: 'Sea view unit with large balcony',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: '4500000.00' })
  price: string;

  @ApiProperty({ example: '180.00' })
  area: string;

  @ApiProperty({ example: 4 })
  rooms: number;

  @ApiProperty({ example: 3 })
  bedrooms: number;

  @ApiProperty({ example: 2 })
  bathrooms: number;

  @ApiProperty({ example: 8, nullable: true })
  floor: number | null;

  @ApiProperty({
    enum: FinishingStatus,
    example: FinishingStatus.Finished,
  })
  finishingStatus: FinishingStatus;

  @ApiProperty({ type: [ApartmentImageResponseDto] })
  images: ApartmentImageResponseDto[];

  @ApiProperty({ example: '2026-08-14T12:00:00.000Z' })
  createdAt: Date;
}

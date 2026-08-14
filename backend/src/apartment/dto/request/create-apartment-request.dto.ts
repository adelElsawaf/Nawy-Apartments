import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';
import { CreateApartmentImageRequestDto } from './create-apartment-image-request.dto';

export class CreateApartmentRequestDto {
  @ApiProperty({
    description: 'Display name of the unit',
    example: 'Sky Villa A',
    maxLength: 120,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  unitName: string;

  @ApiProperty({
    description: 'Unit number (unique within the same project)',
    example: 'A-12',
    maxLength: 50,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unitNumber: string;

  @ApiProperty({
    description: 'Apartment type',
    enum: ApartmentType,
    example: ApartmentType.Apartment,
  })
  @IsEnum(ApartmentType)
  type: ApartmentType;

  @ApiPropertyOptional({
    description: 'Related project id',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number | null;

  @ApiPropertyOptional({
    description: 'Unit description',
    example: 'Sea view unit with large balcony',
    maxLength: 2000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiProperty({
    description: 'Price in EGP',
    example: 4500000,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Area in square meters',
    example: 180,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty({ example: 4, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  rooms: number;

  @ApiProperty({ example: 3, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms: number;

  @ApiPropertyOptional({
    description: 'Floor number',
    example: 8,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  floor?: number | null;

  @ApiProperty({
    description: 'Finishing status',
    enum: FinishingStatus,
    example: FinishingStatus.Finished,
  })
  @IsEnum(FinishingStatus)
  finishingStatus: FinishingStatus;

  @ApiPropertyOptional({
    description: 'Images previously uploaded via /api/uploads',
    type: [CreateApartmentImageRequestDto],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateApartmentImageRequestDto)
  images?: CreateApartmentImageRequestDto[];
}

import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';

@ApiSchema({ name: 'ApartmentGetAllRequestDto' })
export class GetAllRequestDto {
  @ApiPropertyOptional({
    description: 'Search by unit name or project name',
    example: 'Sky',
    maxLength: 120,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  projectId?: number;

  @ApiPropertyOptional({ enum: ApartmentType, example: ApartmentType.Apartment })
  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @ApiPropertyOptional({
    enum: FinishingStatus,
    example: FinishingStatus.Finished,
  })
  @IsOptional()
  @IsEnum(FinishingStatus)
  finishingStatus?: FinishingStatus;

  @ApiPropertyOptional({ example: 1000000, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 8000000, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 80, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ example: 250, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  maxArea?: number;

  @ApiPropertyOptional({ example: 4, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  rooms?: number;

  @ApiPropertyOptional({ example: 3, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2, minimum: 0 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  floor?: number;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? 1 : Number(value),
  )
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 50, default: 20 })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? 20 : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 20;
}

function toOptionalNumber({ value }: { value: unknown }) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Number(value);
}

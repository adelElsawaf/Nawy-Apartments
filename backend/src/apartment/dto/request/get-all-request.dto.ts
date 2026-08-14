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
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';

export class GetAllRequestDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(1)
  projectId?: number;

  @IsOptional()
  @IsEnum(ApartmentType)
  type?: ApartmentType;

  @IsOptional()
  @IsEnum(FinishingStatus)
  finishingStatus?: FinishingStatus;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  minArea?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsNumber()
  @Min(0)
  maxArea?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  rooms?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @Transform(toOptionalNumber)
  @IsInt()
  floor?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? 1 : Number(value),
  )
  @IsInt()
  @Min(1)
  page: number = 1;

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

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
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';
import { CreateApartmentImageRequestDto } from './create-apartment-image-request.dto';

export class CreateApartmentRequestDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  unitName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unitNumber: string;

  @IsEnum(ApartmentType)
  type: ApartmentType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  rooms: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  floor?: number | null;

  @IsEnum(FinishingStatus)
  finishingStatus: FinishingStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateApartmentImageRequestDto)
  images?: CreateApartmentImageRequestDto[];
}

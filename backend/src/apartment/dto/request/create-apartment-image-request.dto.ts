import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApartmentImageType } from '../../enums/apartment-image-type.enum';

export class CreateApartmentImageRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  path: string;

  @IsEnum(ApartmentImageType)
  type: ApartmentImageType;
}

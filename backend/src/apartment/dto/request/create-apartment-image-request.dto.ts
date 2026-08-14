import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApartmentImageType } from '../../enums/apartment-image-type.enum';

export class CreateApartmentImageRequestDto {
  @ApiProperty({
    description: 'Stored image path returned by POST /api/uploads',
    example: '/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  path: string;

  @ApiProperty({
    description: 'Image role',
    enum: ApartmentImageType,
    example: ApartmentImageType.Hero,
  })
  @IsEnum(ApartmentImageType)
  type: ApartmentImageType;
}

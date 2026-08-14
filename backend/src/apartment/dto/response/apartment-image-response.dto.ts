import { ApiProperty } from '@nestjs/swagger';
import { ApartmentImageType } from '../../enums/apartment-image-type.enum';

export class ApartmentImageResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example: '/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
  })
  path: string;

  @ApiProperty({
    example:
      'http://localhost:3000/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
  })
  url: string;

  @ApiProperty({ enum: ApartmentImageType, example: ApartmentImageType.Hero })
  type: ApartmentImageType;

  @ApiProperty({ example: '2026-08-14T12:00:00.000Z' })
  createdAt: Date;
}

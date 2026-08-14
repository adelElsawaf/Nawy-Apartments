import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from '../../../project/dto/response/project-response.dto';
import { ApartmentType } from '../../enums/apartment-type.enum';

export class GetAllItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sky Villa A' })
  unitName: string;

  @ApiProperty({ example: 'A-12' })
  unitNumber: string;

  @ApiProperty({ enum: ApartmentType, example: ApartmentType.Apartment })
  type: ApartmentType;

  @ApiProperty({ example: '4500000.00' })
  price: string;

  @ApiProperty({ example: '180.00' })
  area: string;

  @ApiProperty({ example: 3 })
  bedrooms: number;

  @ApiProperty({ type: ProjectResponseDto, nullable: true })
  project: ProjectResponseDto | null;

  @ApiProperty({
    description: 'Hero image public URL, if present',
    example:
      'http://localhost:3000/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
    nullable: true,
  })
  imageUrl: string | null;
}

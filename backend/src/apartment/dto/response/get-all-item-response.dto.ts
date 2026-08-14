import { ProjectResponseDto } from '../../../project/dto/response/project-response.dto';
import { ApartmentType } from '../../enums/apartment-type.enum';

export class GetAllItemResponseDto {
  id: number;
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  price: string;
  area: string;
  bedrooms: number;
  project: ProjectResponseDto | null;
  imageUrl: string | null;
}

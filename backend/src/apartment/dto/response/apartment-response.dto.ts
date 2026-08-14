import { ProjectResponseDto } from '../../../project/dto/response/project-response.dto';
import { ApartmentType } from '../../enums/apartment-type.enum';
import { FinishingStatus } from '../../enums/finishing-status.enum';
import { ApartmentImageResponseDto } from './apartment-image-response.dto';

export class ApartmentResponseDto {
  id: number;
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  project: ProjectResponseDto | null;
  description: string | null;
  price: string;
  area: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  finishingStatus: FinishingStatus;
  images: ApartmentImageResponseDto[];
  createdAt: Date;
}

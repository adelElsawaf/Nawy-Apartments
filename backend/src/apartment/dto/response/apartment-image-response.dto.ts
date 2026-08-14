import { ApartmentImageType } from '../../enums/apartment-image-type.enum';

export class ApartmentImageResponseDto {
  id: number;
  path: string;
  url: string;
  type: ApartmentImageType;
  createdAt: Date;
}

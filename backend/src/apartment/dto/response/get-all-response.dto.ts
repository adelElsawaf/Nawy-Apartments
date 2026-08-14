import { GetAllItemResponseDto } from './get-all-item-response.dto';

export class GetAllResponseDto {
  data: GetAllItemResponseDto[];
  page: number;
  limit: number;
  hasNextPage: boolean;
}

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { GetAllItemResponseDto } from './get-all-item-response.dto';

@ApiSchema({ name: 'ApartmentGetAllResponseDto' })
export class GetAllResponseDto {
  @ApiProperty({ type: [GetAllItemResponseDto] })
  data: GetAllItemResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: false })
  hasNextPage: boolean;
}

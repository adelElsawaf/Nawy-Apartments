import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ProjectResponseDto } from './project-response.dto';

@ApiSchema({ name: 'ProjectGetAllResponseDto' })
export class GetAllResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  data: ProjectResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: false })
  hasNextPage: boolean;
}

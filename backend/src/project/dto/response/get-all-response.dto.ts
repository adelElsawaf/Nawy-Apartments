import { ProjectResponseDto } from './project-response.dto';

export class GetAllResponseDto {
  data: ProjectResponseDto[];
  page: number;
  limit: number;
  hasNextPage: boolean;
}

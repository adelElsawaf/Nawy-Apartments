import { UploadResponseDto } from '../dto/response/upload-response.dto';

export type StoredFile = {
  path: string;
  url: string;
};

export class UploadMapper {
  static toResponseDto(stored: StoredFile): UploadResponseDto {
    const response = new UploadResponseDto();
    response.path = stored.path;
    response.url = stored.url;
    return response;
  }
}

import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadResponseDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsUrl({ require_tld: false })
  url: string;
}

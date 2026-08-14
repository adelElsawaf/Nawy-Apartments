import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Relative path stored in the database',
    example: '/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
  })
  path: string;

  @ApiProperty({
    description: 'Public URL built from APP_URL',
    example:
      'http://localhost:3000/uploads/images/80347ba3-4516-4d97-853c-788a374d0b4c.jpeg',
  })
  url: string;
}

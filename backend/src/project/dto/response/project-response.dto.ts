import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Palm Hills' })
  name: string;

  @ApiProperty({
    example: 'Gated community in New Cairo',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: '2026-08-14T12:00:00.000Z' })
  createdAt: Date;
}

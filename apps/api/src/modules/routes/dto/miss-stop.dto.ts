import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MissStopDto {
  @ApiProperty({ example: '2026-04-08T14:30:00.000Z' })
  @IsDateString()
  timestamp: string;

  @ApiPropertyOptional({ example: 'No bags outside door' })
  @IsOptional()
  @IsString()
  reason?: string;
}

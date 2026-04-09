import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompleteStopDto {
  @ApiProperty({ example: '2026-04-08T14:30:00.000Z' })
  @IsDateString()
  timestamp!: string;

  @ApiPropertyOptional({ example: 32.8089 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: -96.8023 })
  @IsOptional()
  @IsNumber()
  lng?: number;
}

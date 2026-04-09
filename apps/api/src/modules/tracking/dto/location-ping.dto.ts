import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationPingDto {
  @ApiPropertyOptional({ example: 'route-001' })
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiProperty({ example: '2026-04-08T14:30:00.000Z' })
  @IsDateString()
  timestamp!: string;

  @ApiProperty({ example: 32.8089 })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: -96.8023 })
  @IsNumber()
  lng!: number;

  @ApiPropertyOptional({ example: 5.2 })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsNumber()
  heading?: number;
}

import { IsString, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({ example: 'prop-001' })
  @IsString()
  propertyId: string;

  @ApiProperty({ example: '2026-04-08' })
  @IsDateString()
  serviceDate: string;

  @ApiProperty({ example: ['unit-001', 'unit-002'] })
  @IsArray()
  @IsString({ each: true })
  unitIds: string[];
}

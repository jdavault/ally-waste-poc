import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IssueCode } from '@ally-waste/shared-types';

export class PendingActionDto {
  @ApiProperty({ enum: ['COMPLETE_STOP', 'MISS_STOP', 'REPORT_ISSUE', 'LOCATION_PING'] })
  @IsString()
  type: 'COMPLETE_STOP' | 'MISS_STOP' | 'REPORT_ISSUE' | 'LOCATION_PING';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stopId?: string;

  @ApiProperty()
  @IsDateString()
  timestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ enum: IssueCode })
  @IsOptional()
  @IsEnum(IssueCode)
  issueCode?: IssueCode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  heading?: number;
}

export class SyncBatchDto {
  @ApiProperty()
  @IsString()
  workerId: string;

  @ApiProperty({ type: [PendingActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PendingActionDto)
  actions: PendingActionDto[];
}

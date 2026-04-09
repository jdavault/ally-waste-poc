import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueCode } from '@ally-waste/shared-types';

export class ReportIssueDto {
  @ApiProperty({ example: '2026-04-08T14:30:00.000Z' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ enum: IssueCode, example: IssueCode.NO_ACCESS })
  @IsEnum(IssueCode)
  issueCode: IssueCode;

  @ApiPropertyOptional({ example: 'Gate code did not work' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 32.8089 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: -96.8023 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

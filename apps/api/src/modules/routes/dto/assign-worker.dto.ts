import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignWorkerDto {
  @ApiProperty({ example: 'worker-001' })
  @IsString()
  workerId!: string;
}

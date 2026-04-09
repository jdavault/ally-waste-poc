import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@Controller()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('properties/:propertyId/schedules')
  @ApiOperation({ summary: 'List pickup schedules for a property' })
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.schedulesService.findByPropertyId(propertyId);
  }
}

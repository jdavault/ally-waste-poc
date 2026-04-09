import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { LocationPingDto } from './dto/location-ping.dto';

@ApiTags('tracking')
@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('workers/:workerId/location-ping')
  @ApiOperation({ summary: 'Record a GPS location ping from a worker' })
  recordPing(
    @Param('workerId') workerId: string,
    @Body() dto: LocationPingDto,
  ) {
    return this.trackingService.recordPing(workerId, dto);
  }
}

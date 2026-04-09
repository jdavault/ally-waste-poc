import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { VehiclePingsRepository } from './vehicle-pings.repository';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [TrackingController],
  providers: [TrackingService, VehiclePingsRepository],
  exports: [TrackingService, VehiclePingsRepository],
})
export class TrackingModule {}

import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { RoutesModule } from '../routes/routes.module';
import { TrackingModule } from '../tracking/tracking.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [RoutesModule, TrackingModule, EventsModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}

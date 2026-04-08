import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './modules/properties/properties.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { UnitsModule } from './modules/units/units.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { WorkersModule } from './modules/workers/workers.module';
import { RoutesModule } from './modules/routes/routes.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { SyncModule } from './modules/sync/sync.module';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, PropertiesModule, BuildingsModule, UnitsModule, SchedulesModule, WorkersModule, RoutesModule, TrackingModule, SyncModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

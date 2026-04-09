import { Module } from '@nestjs/common';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RoutesRepository } from './routes.repository';
import { RouteStopsRepository } from './route-stops.repository';
import { EventsModule } from '../events/events.module';
import { UnitsModule } from '../units/units.module';
import { BuildingsModule } from '../buildings/buildings.module';

@Module({
  imports: [EventsModule, UnitsModule, BuildingsModule],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesRepository, RouteStopsRepository],
  exports: [RoutesService, RoutesRepository, RouteStopsRepository],
})
export class RoutesModule {}

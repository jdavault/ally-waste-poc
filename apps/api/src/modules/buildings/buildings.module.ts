import { Module } from '@nestjs/common';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { BuildingsRepository } from './buildings.repository';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [UnitsModule],
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingsRepository],
  exports: [BuildingsService, BuildingsRepository],
})
export class BuildingsModule {}

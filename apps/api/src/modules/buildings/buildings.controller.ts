import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BuildingsService } from './buildings.service';
import { UnitsService } from '../units/units.service';

@ApiTags('buildings')
@Controller()
export class BuildingsController {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly unitsService: UnitsService,
  ) {}

  @Get('properties/:propertyId/buildings')
  @ApiOperation({ summary: 'List buildings for a property' })
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.buildingsService.findByPropertyId(propertyId);
  }

  @Get('buildings/:id')
  @ApiOperation({ summary: 'Get a building by ID' })
  findById(@Param('id') id: string) {
    return this.buildingsService.findById(id);
  }

  @Get('buildings/:buildingId/units')
  @ApiOperation({ summary: 'List units for a building' })
  findUnits(@Param('buildingId') buildingId: string) {
    return this.unitsService.findByBuildingId(buildingId);
  }
}

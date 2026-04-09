import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UnitsService } from './units.service';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a unit by ID' })
  findById(@Param('id') id: string) {
    return this.unitsService.findById(id);
  }
}

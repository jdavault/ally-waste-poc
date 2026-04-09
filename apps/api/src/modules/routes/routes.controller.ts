import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { MissStopDto } from './dto/miss-stop.dto';
import { ReportIssueDto } from './dto/report-issue.dto';

@ApiTags('routes')
@Controller()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get('routes')
  @ApiOperation({ summary: 'List all routes' })
  findAll() {
    return this.routesService.findAll();
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Get a route by ID' })
  findById(@Param('id') id: string) {
    return this.routesService.findById(id);
  }

  @Get('routes/:id/stops')
  @ApiOperation({ summary: 'List stops for a route' })
  findStops(@Param('id') id: string) {
    return this.routesService.findStopsByRouteId(id);
  }

  @Get('workers/:workerId/today-route')
  @ApiOperation({ summary: "Get a worker's route for today" })
  findTodayRoute(@Param('workerId') workerId: string) {
    const route = this.routesService.findTodayByWorkerId(workerId);
    if (!route) {
      return { message: 'No route assigned for today' };
    }
    const stops = this.routesService.findStopsByRouteId(route.id);
    return { route, stops };
  }

  @Post('routes')
  @ApiOperation({ summary: 'Create a new route' })
  create(@Body() dto: CreateRouteDto) {
    return this.routesService.create(dto);
  }

  @Post('routes/:id/assign-worker')
  @ApiOperation({ summary: 'Assign a worker to a route' })
  assignWorker(@Param('id') id: string, @Body() dto: AssignWorkerDto) {
    return this.routesService.assignWorker(id, dto);
  }

  @Post('routes/:id/start')
  @ApiOperation({ summary: 'Start a route' })
  startRoute(@Param('id') id: string) {
    return this.routesService.startRoute(id);
  }

  @Post('route-stops/:id/complete')
  @ApiOperation({ summary: 'Mark a stop as completed' })
  completeStop(@Param('id') id: string, @Body() dto: CompleteStopDto) {
    return this.routesService.completeStop(id, dto);
  }

  @Post('route-stops/:id/miss')
  @ApiOperation({ summary: 'Mark a stop as missed' })
  missStop(@Param('id') id: string, @Body() dto: MissStopDto) {
    return this.routesService.missStop(id, dto);
  }

  @Post('route-stops/:id/issue')
  @ApiOperation({ summary: 'Report an issue on a stop' })
  reportIssue(@Param('id') id: string, @Body() dto: ReportIssueDto) {
    return this.routesService.reportIssue(id, dto);
  }
}

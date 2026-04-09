import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Route,
  RouteStop,
  RouteStatus,
  RouteStopStatus,
  EventType,
  EntityType,
  getProximityResult,
} from '@ally-waste/shared-types';
import { RoutesRepository } from './routes.repository';
import { RouteStopsRepository } from './route-stops.repository';
import { EventsService } from '../events/events.service';
import { UnitsRepository } from '../units/units.repository';
import { BuildingsRepository } from '../buildings/buildings.repository';
import { CreateRouteDto } from './dto/create-route.dto';
import { AssignWorkerDto } from './dto/assign-worker.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { MissStopDto } from './dto/miss-stop.dto';
import { ReportIssueDto } from './dto/report-issue.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RoutesService {
  constructor(
    private readonly routesRepository: RoutesRepository,
    private readonly routeStopsRepository: RouteStopsRepository,
    private readonly eventsService: EventsService,
    private readonly unitsRepository: UnitsRepository,
    private readonly buildingsRepository: BuildingsRepository,
  ) {}

  findAll(): Route[] {
    return this.routesRepository.findAll();
  }

  findById(id: string): Route {
    const route = this.routesRepository.findById(id);
    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }
    return route;
  }

  findStopsByRouteId(routeId: string): RouteStop[] {
    this.findById(routeId); // ensure route exists
    return this.routeStopsRepository.findByRouteId(routeId);
  }

  findStopById(id: string): RouteStop {
    const stop = this.routeStopsRepository.findById(id);
    if (!stop) {
      throw new NotFoundException(`Stop ${id} not found`);
    }
    return stop;
  }

  findTodayByWorkerId(workerId: string): Route | undefined {
    return this.routesRepository.findTodayByWorkerId(workerId);
  }

  create(dto: CreateRouteDto): Route {
    const now = new Date().toISOString();
    const route: Route = {
      id: uuid(),
      propertyId: dto.propertyId,
      workerId: null,
      serviceDate: dto.serviceDate,
      status: RouteStatus.PENDING,
      startedAt: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.routesRepository.create(route);

    // Create stops from unit IDs
    dto.unitIds.forEach((unitId, index) => {
      const unit = this.unitsRepository.findById(unitId);
      const stop: RouteStop = {
        id: uuid(),
        routeId: route.id,
        buildingId: unit?.buildingId ?? '',
        unitId,
        sequence: index + 1,
        status: RouteStopStatus.PENDING,
        completedAt: null,
        lat: null,
        lng: null,
        issueCode: null,
        issueNotes: null,
        photoUrl: null,
        createdAt: now,
        updatedAt: now,
      };
      this.routeStopsRepository.create(stop);
    });

    return route;
  }

  assignWorker(routeId: string, dto: AssignWorkerDto): Route {
    this.findById(routeId);
    const updated = this.routesRepository.update(routeId, {
      workerId: dto.workerId,
      updatedAt: new Date().toISOString(),
    });
    return updated!;
  }

  startRoute(routeId: string): Route {
    const route = this.findById(routeId);
    const now = new Date().toISOString();
    const updated = this.routesRepository.update(routeId, {
      status: RouteStatus.IN_PROGRESS,
      startedAt: now,
      updatedAt: now,
    });

    this.eventsService.logEvent(
      EntityType.ROUTE,
      routeId,
      EventType.ROUTE_STARTED,
      { workerId: route.workerId },
    );

    return updated!;
  }

  completeStop(stopId: string, dto: CompleteStopDto): RouteStop {
    const stop = this.routeStopsRepository.findById(stopId);
    if (!stop) {
      throw new NotFoundException(`Stop ${stopId} not found`);
    }

    const proximity = this.getStopProximity(stop.buildingId, dto.lat, dto.lng);

    const updated = this.routeStopsRepository.update(stopId, {
      status: RouteStopStatus.COMPLETED,
      completedAt: dto.timestamp,
      lat: dto.lat ?? null,
      lng: dto.lng ?? null,
      updatedAt: new Date().toISOString(),
    });

    this.eventsService.logEvent(
      EntityType.ROUTE_STOP,
      stopId,
      EventType.STOP_COMPLETED,
      {
        lat: dto.lat,
        lng: dto.lng,
        distanceMeters: proximity?.distanceMeters,
        distanceMiles: proximity?.distanceMiles,
        proximityBand: proximity?.band,
        proximityLabel: proximity?.label,
      },
    );

    this.checkRouteCompletion(stop.routeId);
    return updated!;
  }

  missStop(stopId: string, dto: MissStopDto): RouteStop {
    const stop = this.routeStopsRepository.findById(stopId);
    if (!stop) {
      throw new NotFoundException(`Stop ${stopId} not found`);
    }

    const updated = this.routeStopsRepository.update(stopId, {
      status: RouteStopStatus.MISSED,
      issueNotes: dto.reason ?? null,
      updatedAt: new Date().toISOString(),
    });

    this.eventsService.logEvent(
      EntityType.ROUTE_STOP,
      stopId,
      EventType.STOP_MISSED,
      { reason: dto.reason },
    );

    this.checkRouteCompletion(stop.routeId);
    return updated!;
  }

  reportIssue(stopId: string, dto: ReportIssueDto): RouteStop {
    const stop = this.routeStopsRepository.findById(stopId);
    if (!stop) {
      throw new NotFoundException(`Stop ${stopId} not found`);
    }

    const proximity = this.getStopProximity(stop.buildingId, dto.lat, dto.lng);

    const updated = this.routeStopsRepository.update(stopId, {
      status: RouteStopStatus.ISSUE,
      issueCode: dto.issueCode,
      issueNotes: dto.notes ?? null,
      lat: dto.lat ?? null,
      lng: dto.lng ?? null,
      photoUrl: dto.photoUrl ?? null,
      updatedAt: new Date().toISOString(),
    });

    this.eventsService.logEvent(
      EntityType.ROUTE_STOP,
      stopId,
      EventType.STOP_ISSUE,
      {
        issueCode: dto.issueCode,
        notes: dto.notes,
        lat: dto.lat,
        lng: dto.lng,
        distanceMeters: proximity?.distanceMeters,
        distanceMiles: proximity?.distanceMiles,
        proximityBand: proximity?.band,
        proximityLabel: proximity?.label,
      },
    );

    this.checkRouteCompletion(stop.routeId);
    return updated!;
  }

  private checkRouteCompletion(routeId: string): void {
    const stops = this.routeStopsRepository.findByRouteId(routeId);
    const allDone = stops.every((s) => s.status !== RouteStopStatus.PENDING);

    if (allDone) {
      const now = new Date().toISOString();
      this.routesRepository.update(routeId, {
        status: RouteStatus.COMPLETED,
        completedAt: now,
        updatedAt: now,
      });

      this.eventsService.logEvent(
        EntityType.ROUTE,
        routeId,
        EventType.ROUTE_COMPLETED,
        {
          stopsCompleted: stops.filter(
            (s) => s.status === RouteStopStatus.COMPLETED,
          ).length,
        },
      );
    }
  }

  private getStopProximity(buildingId: string, lat?: number, lng?: number) {
    if (lat == null || lng == null) {
      return null;
    }

    const building = this.buildingsRepository.findById(buildingId);
    if (!building) {
      return null;
    }

    return getProximityResult(
      { lat, lng },
      { lat: building.lat, lng: building.lng },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { VehiclePing, EventType, EntityType } from '@ally-waste/shared-types';
import { VehiclePingsRepository } from './vehicle-pings.repository';
import { EventsService } from '../events/events.service';
import { LocationPingDto } from './dto/location-ping.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TrackingService {
  constructor(
    private readonly vehiclePingsRepository: VehiclePingsRepository,
    private readonly eventsService: EventsService,
  ) {}

  recordPing(workerId: string, dto: LocationPingDto): VehiclePing {
    const ping: VehiclePing = {
      id: uuid(),
      workerId,
      routeId: dto.routeId ?? null,
      timestamp: dto.timestamp,
      lat: dto.lat,
      lng: dto.lng,
      speed: dto.speed ?? null,
      heading: dto.heading ?? null,
    };
    this.vehiclePingsRepository.create(ping);

    this.eventsService.logEvent(
      EntityType.WORKER,
      workerId,
      EventType.LOCATION_PING,
      { lat: dto.lat, lng: dto.lng, routeId: dto.routeId },
    );

    return ping;
  }

  findByRouteId(routeId: string): VehiclePing[] {
    return this.vehiclePingsRepository.findByRouteId(routeId);
  }
}

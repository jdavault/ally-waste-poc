import { Injectable } from '@nestjs/common';
import { EventType, EntityType } from '@ally-waste/shared-types';
import { RoutesService } from '../routes/routes.service';
import { TrackingService } from '../tracking/tracking.service';
import { EventsService } from '../events/events.service';
import { SyncBatchDto, PendingActionDto } from './dto/sync-batch.dto';

export interface SyncResult {
  processed: number;
  failed: number;
  errors: Array<{ index: number; action: PendingActionDto; error: string }>;
}

@Injectable()
export class SyncService {
  constructor(
    private readonly routesService: RoutesService,
    private readonly trackingService: TrackingService,
    private readonly eventsService: EventsService,
  ) {}

  processBatch(dto: SyncBatchDto): SyncResult {
    let processed = 0;
    let failed = 0;
    const errors: SyncResult['errors'] = [];

    dto.actions.forEach((action, index) => {
      try {
        this.processAction(dto.workerId, action);
        processed++;
      } catch (err) {
        failed++;
        errors.push({
          index,
          action,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    });

    this.eventsService.logEvent(
      EntityType.WORKER,
      dto.workerId,
      EventType.SYNC_BATCH,
      { processed, failed, actionCount: dto.actions.length },
    );

    return { processed, failed, errors };
  }

  private processAction(workerId: string, action: PendingActionDto): void {
    switch (action.type) {
      case 'COMPLETE_STOP':
        this.routesService.completeStop(action.stopId!, {
          timestamp: action.timestamp,
          lat: action.lat,
          lng: action.lng,
        });
        break;

      case 'MISS_STOP':
        this.routesService.missStop(action.stopId!, {
          timestamp: action.timestamp,
          reason: action.reason,
        });
        break;

      case 'REPORT_ISSUE':
        this.routesService.reportIssue(action.stopId!, {
          timestamp: action.timestamp,
          issueCode: action.issueCode!,
          notes: action.notes,
          lat: action.lat,
          lng: action.lng,
        });
        break;

      case 'LOCATION_PING':
        this.trackingService.recordPing(workerId, {
          routeId: action.routeId,
          timestamp: action.timestamp,
          lat: action.lat!,
          lng: action.lng!,
          speed: action.speed,
          heading: action.heading,
        });
        break;
    }
  }
}

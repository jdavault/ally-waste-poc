import { IssueCode } from './enums';

// --- Route DTOs ---

export interface CreateRouteDto {
  propertyId: string;
  serviceDate: string;
  unitIds: string[];
}

export interface AssignWorkerDto {
  workerId: string;
}

// --- Route Stop Action DTOs ---

export interface CompleteStopDto {
  timestamp: string;
  lat?: number;
  lng?: number;
}

export interface MissStopDto {
  timestamp: string;
  reason?: string;
}

export interface ReportIssueDto {
  timestamp: string;
  issueCode: IssueCode;
  notes?: string;
  lat?: number;
  lng?: number;
  photoUrl?: string;
}

// --- Tracking DTOs ---

export interface LocationPingDto {
  routeId?: string;
  timestamp: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
}

// --- Sync DTOs ---

export interface SyncBatchDto {
  workerId: string;
  actions: PendingActionDto[];
}

export type PendingActionDto =
  | {
      type: 'COMPLETE_STOP';
      stopId: string;
      timestamp: string;
      lat?: number;
      lng?: number;
    }
  | {
      type: 'MISS_STOP';
      stopId: string;
      timestamp: string;
      reason?: string;
    }
  | {
      type: 'REPORT_ISSUE';
      stopId: string;
      timestamp: string;
      issueCode: IssueCode;
      notes?: string;
      lat?: number;
      lng?: number;
    }
  | {
      type: 'LOCATION_PING';
      routeId?: string;
      timestamp: string;
      lat: number;
      lng: number;
      speed?: number;
      heading?: number;
    };

export interface SyncBatchResultDto {
  processed: number;
  failed: number;
  errors: Array<{
    index: number;
    action: PendingActionDto;
    error: string;
  }>;
}

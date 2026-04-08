import {
  RouteStatus,
  RouteStopStatus,
  IssueCode,
  DayOfWeek,
  VehicleType,
  EventType,
  EntityType,
} from './enums';

export interface Property {
  id: string;
  name: string;
  address: string;
  timezone: string;
  lat: number;
  lng: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  propertyId: string;
  name: string;
  accessNotes: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  floor: number;
  serviceNotes: string;
  pickupInstructions: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PickupSchedule {
  id: string;
  propertyId: string;
  daysOfWeek: DayOfWeek[];
  timeWindowStart: string;
  timeWindowEnd: string;
  active: boolean;
  specialInstructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  propertyId: string;
  workerId: string | null;
  serviceDate: string;
  status: RouteStatus;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RouteStop {
  id: string;
  routeId: string;
  buildingId: string;
  unitId: string;
  sequence: number;
  status: RouteStopStatus;
  completedAt: string | null;
  lat: number | null;
  lng: number | null;
  issueCode: IssueCode | null;
  issueNotes: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePing {
  id: string;
  workerId: string;
  routeId: string | null;
  timestamp: string;
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
}

export interface EventLog {
  id: string;
  entityType: EntityType;
  entityId: string;
  eventType: EventType;
  payload: Record<string, unknown>;
  createdAt: string;
}

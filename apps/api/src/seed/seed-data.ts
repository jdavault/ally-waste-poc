import {
  Property,
  Building,
  Unit,
  PickupSchedule,
  Worker,
  Route,
  RouteStop,
  VehiclePing,
  EventLog,
  RouteStatus,
  RouteStopStatus,
  IssueCode,
  DayOfWeek,
  VehicleType,
  EventType,
  EntityType,
} from '@ally-waste/shared-types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

export const properties: Property[] = [
  {
    id: 'prop-001',
    name: 'Oakwood Courtyards',
    address: '210 E McKinley St, Phoenix, AZ 85004',
    timezone: 'America/Phoenix',
    lat: 33.4563,
    lng: -112.0701,
    active: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'prop-002',
    name: 'Stevens Creek Residences',
    address: '550 E Roosevelt St, Phoenix, AZ 85004',
    timezone: 'America/Phoenix',
    lat: 33.4584,
    lng: -112.0669,
    active: true,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Buildings
// ---------------------------------------------------------------------------

export const buildings: Building[] = [
  // Oakwood Courtyards
  {
    id: 'bldg-001',
    propertyId: 'prop-001',
    name: 'Building A',
    accessNotes: 'Main entrance code: 4521. Dumpster area behind north wing.',
    lat: 33.4565,
    lng: -112.0698,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'bldg-002',
    propertyId: 'prop-001',
    name: 'Building B',
    accessNotes: 'Gate code: 7890. Use side entrance for trash area.',
    lat: 33.456,
    lng: -112.0705,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  // Stevens Creek Residences
  {
    id: 'bldg-003',
    propertyId: 'prop-002',
    name: 'Tower 1',
    accessNotes: 'Lobby access via key fob. Service elevator on east side.',
    lat: 33.4587,
    lng: -112.0666,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'bldg-004',
    propertyId: 'prop-002',
    name: 'Tower 2',
    accessNotes:
      'Enter through parking garage level 1. Trash chute room on each floor.',
    lat: 33.4581,
    lng: -112.0672,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

function makeUnits(
  buildingId: string,
  floors: number,
  unitsPerFloor: number,
  startIndex: number,
): Unit[] {
  const result: Unit[] = [];
  let idx = startIndex;
  for (let floor = 1; floor <= floors; floor++) {
    for (let u = 1; u <= unitsPerFloor; u++) {
      const unitNum = `${floor}0${u}`;
      idx++;
      result.push({
        id: `unit-${String(idx).padStart(3, '0')}`,
        buildingId,
        unitNumber: unitNum,
        floor,
        serviceNotes: '',
        pickupInstructions:
          'Place bags outside door by 8 PM night before pickup.',
        active: true,
        createdAt: '2026-01-15T00:00:00.000Z',
        updatedAt: '2026-01-15T00:00:00.000Z',
      });
    }
  }
  return result;
}

// Bldg A: 2 floors, 3 units each = 6 units
// Bldg B: 2 floors, 2 units each = 4 units
// Tower 1: 3 floors, 2 units each = 6 units
// Tower 2: 2 floors, 2 units each = 4 units
// Total: 20 units

export const units: Unit[] = [
  ...makeUnits('bldg-001', 2, 3, 0), // unit-001 through unit-006
  ...makeUnits('bldg-002', 2, 2, 6), // unit-007 through unit-010
  ...makeUnits('bldg-003', 3, 2, 10), // unit-011 through unit-016
  ...makeUnits('bldg-004', 2, 2, 16), // unit-017 through unit-020
];

// Add variety to a few units
units[2].serviceNotes = 'Elderly resident — knock gently.';
units[5].serviceNotes = 'Large family — often has extra bags.';
units[9].pickupInstructions = 'Bags left in hallway nook near elevator.';
units[14].active = false; // vacant unit
units[14].serviceNotes = 'Unit vacant — skip until further notice.';

// ---------------------------------------------------------------------------
// Pickup Schedules
// ---------------------------------------------------------------------------

export const pickupSchedules: PickupSchedule[] = [
  {
    id: 'sched-001',
    propertyId: 'prop-001',
    daysOfWeek: [DayOfWeek.MON, DayOfWeek.WED, DayOfWeek.FRI],
    timeWindowStart: '06:00',
    timeWindowEnd: '10:00',
    active: true,
    specialInstructions: 'Start with Building A, then Building B.',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'sched-002',
    propertyId: 'prop-002',
    daysOfWeek: [DayOfWeek.TUE, DayOfWeek.THU, DayOfWeek.SAT],
    timeWindowStart: '07:00',
    timeWindowEnd: '11:00',
    active: true,
    specialInstructions: 'Tower 1 first. Use service elevator only.',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Workers
// ---------------------------------------------------------------------------

export const workers: Worker[] = [
  {
    id: 'worker-001',
    name: 'Marcus Johnson',
    phone: '214-555-0101',
    vehicleType: VehicleType.TRUCK,
    active: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'worker-002',
    name: 'Sofia Ramirez',
    phone: '214-555-0102',
    vehicleType: VehicleType.VAN,
    active: true,
    createdAt: '2026-01-12T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'worker-003',
    name: 'David Chen',
    phone: '214-555-0103',
    vehicleType: VehicleType.CART,
    active: true,
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Routes  (today's date — one per property)
// ---------------------------------------------------------------------------

export const routes: Route[] = [
  {
    id: 'route-001',
    propertyId: 'prop-001',
    workerId: 'worker-001',
    serviceDate: today,
    status: RouteStatus.IN_PROGRESS,
    startedAt: twoHoursAgo,
    completedAt: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: 'route-002',
    propertyId: 'prop-002',
    workerId: 'worker-002',
    serviceDate: today,
    status: RouteStatus.PENDING,
    startedAt: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  },
];

// ---------------------------------------------------------------------------
// Route Stops
// ---------------------------------------------------------------------------

// Route 1 (Oakwood — Buildings A & B, 10 units)
// Marcus has completed 4, missed 1, reported issue on 1, 4 still pending
const oakwoodUnits = units.filter(
  (u) => u.buildingId === 'bldg-001' || u.buildingId === 'bldg-002',
);

export const routeStops: RouteStop[] = oakwoodUnits.map((u, i) => {
  let status = RouteStopStatus.PENDING;
  let completedAt: string | null = null;
  let issueCode: IssueCode | null = null;
  let issueNotes: string | null = null;
  let lat: number | null = null;
  let lng: number | null = null;

  if (i < 4) {
    // First 4 completed
    status = RouteStopStatus.COMPLETED;
    completedAt = new Date(
      Date.now() - (120 - i * 15) * 60 * 1000,
    ).toISOString();
    lat = 32.8089 + i * 0.0001;
    lng = -96.8023 + i * 0.0001;
  } else if (i === 4) {
    // 5th stop missed
    status = RouteStopStatus.MISSED;
    issueNotes = 'No bags outside door.';
  } else if (i === 5) {
    // 6th stop has issue
    status = RouteStopStatus.ISSUE;
    issueCode = IssueCode.NO_ACCESS;
    issueNotes = 'Gate code did not work — could not access unit area.';
  }

  return {
    id: `stop-${String(i + 1).padStart(3, '0')}`,
    routeId: 'route-001',
    buildingId: u.buildingId,
    unitId: u.id,
    sequence: i + 1,
    status,
    completedAt,
    lat,
    lng,
    issueCode,
    issueNotes,
    photoUrl: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  };
});

// Route 2 (Riverside — Towers 1 & 2, 10 units) — all pending
const riversideUnits = units.filter(
  (u) => u.buildingId === 'bldg-003' || u.buildingId === 'bldg-004',
);

routeStops.push(
  ...riversideUnits.map((u, i) => ({
    id: `stop-${String(i + 11).padStart(3, '0')}`,
    routeId: 'route-002',
    buildingId: u.buildingId,
    unitId: u.id,
    sequence: i + 1,
    status: RouteStopStatus.PENDING,
    completedAt: null,
    lat: null,
    lng: null,
    issueCode: null,
    issueNotes: null,
    photoUrl: null,
    createdAt: now,
    updatedAt: now,
  })),
);

// ---------------------------------------------------------------------------
// Vehicle Pings  (Marcus — route in progress)
// ---------------------------------------------------------------------------

export const vehiclePings: VehiclePing[] = [
  {
    id: 'ping-001',
    workerId: 'worker-001',
    routeId: 'route-001',
    timestamp: twoHoursAgo,
    lat: 32.8087,
    lng: -96.8021,
    speed: 0,
    heading: null,
  },
  {
    id: 'ping-002',
    workerId: 'worker-001',
    routeId: 'route-001',
    timestamp: hourAgo,
    lat: 32.809,
    lng: -96.8019,
    speed: 5,
    heading: 45,
  },
  {
    id: 'ping-003',
    workerId: 'worker-001',
    routeId: 'route-001',
    timestamp: now,
    lat: 32.8092,
    lng: -96.8017,
    speed: 0,
    heading: null,
  },
];

// ---------------------------------------------------------------------------
// Event Log
// ---------------------------------------------------------------------------

export const eventLogs: EventLog[] = [
  {
    id: 'evt-001',
    entityType: EntityType.ROUTE,
    entityId: 'route-001',
    eventType: EventType.ROUTE_STARTED,
    payload: { workerId: 'worker-001' },
    createdAt: twoHoursAgo,
  },
  {
    id: 'evt-002',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-001',
    eventType: EventType.STOP_COMPLETED,
    payload: { lat: 32.8089, lng: -96.8023 },
    createdAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-003',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-002',
    eventType: EventType.STOP_COMPLETED,
    payload: { lat: 32.809, lng: -96.8022 },
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-004',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-003',
    eventType: EventType.STOP_COMPLETED,
    payload: { lat: 32.8091, lng: -96.8021 },
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-005',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-004',
    eventType: EventType.STOP_COMPLETED,
    payload: { lat: 32.8092, lng: -96.802 },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-006',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-005',
    eventType: EventType.STOP_MISSED,
    payload: { reason: 'No bags outside door.' },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-007',
    entityType: EntityType.ROUTE_STOP,
    entityId: 'stop-006',
    eventType: EventType.STOP_ISSUE,
    payload: {
      issueCode: IssueCode.NO_ACCESS,
      notes: 'Gate code did not work — could not access unit area.',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-008',
    entityType: EntityType.WORKER,
    entityId: 'worker-001',
    eventType: EventType.LOCATION_PING,
    payload: { lat: 32.8092, lng: -96.8017, routeId: 'route-001' },
    createdAt: now,
  },
];

export type ProximityBand = 'ON_SITE' | 'NEARBY' | 'FAR_AWAY' | 'UNKNOWN';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ProximityResult {
  distanceMeters: number;
  band: ProximityBand;
  label: string;
}

const EARTH_RADIUS_METERS = 6371000;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(
  origin: Coordinates,
  target: Coordinates,
): number {
  const latDelta = toRadians(target.lat - origin.lat);
  const lngDelta = toRadians(target.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const targetLat = toRadians(target.lat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) *
      Math.cos(targetLat) *
      Math.sin(lngDelta / 2) ** 2;

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Math.round(EARTH_RADIUS_METERS * arc);
}

export function getProximityBand(distanceMeters: number): ProximityBand {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    return 'UNKNOWN';
  }

  if (distanceMeters <= 40) {
    return 'ON_SITE';
  }

  if (distanceMeters <= 150) {
    return 'NEARBY';
  }

  return 'FAR_AWAY';
}

export function formatProximityLabel(band: ProximityBand): string {
  switch (band) {
    case 'ON_SITE':
      return 'On-site';
    case 'NEARBY':
      return 'Nearby';
    case 'FAR_AWAY':
      return 'Far away';
    default:
      return 'Unknown';
  }
}

export function getProximityResult(
  origin?: Coordinates | null,
  target?: Coordinates | null,
): ProximityResult | null {
  if (!origin || !target) {
    return null;
  }

  const distanceMeters = calculateDistanceMeters(origin, target);
  const band = getProximityBand(distanceMeters);

  return {
    distanceMeters,
    band,
    label: formatProximityLabel(band),
  };
}

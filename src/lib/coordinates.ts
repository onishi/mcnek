import type { RoadsideStation } from "../types/roadsideStation";

export function isValidCoordinate(
  latitude: number,
  longitude: number,
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function hasCoordinates(
  station: Pick<RoadsideStation, "latitude" | "longitude">,
): boolean {
  return station.latitude !== null && station.longitude !== null;
}

export function findStationsWithoutCoordinates(
  stations: RoadsideStation[],
): RoadsideStation[] {
  return stations.filter((station) => !hasCoordinates(station));
}

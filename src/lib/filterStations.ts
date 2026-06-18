import { getRegion } from "../data/regions";
import type {
  Prefecture,
  Region,
  RoadsideStation,
} from "../types/roadsideStation";

export type StationFilter = {
  query?: string;
  prefecture?: Prefecture;
  region?: Region;
};

export function filterStations(
  stations: RoadsideStation[],
  filter: StationFilter,
): RoadsideStation[] {
  const query = filter.query?.trim();

  return stations.filter((station) => {
    if (query && !station.name.includes(query)) {
      return false;
    }
    if (filter.prefecture && station.prefecture !== filter.prefecture) {
      return false;
    }
    if (filter.region && getRegion(station.prefecture) !== filter.region) {
      return false;
    }
    return true;
  });
}

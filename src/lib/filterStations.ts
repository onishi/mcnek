import { getRegion } from "../data/regions";
import type {
  Prefecture,
  Region,
  RoadsideStation,
} from "../types/roadsideStation";

export type StationFilter = {
  query?: string;
  prefectures?: Prefecture[];
  regions?: Region[];
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
    if (filter.prefectures?.length && !filter.prefectures.includes(station.prefecture)) {
      return false;
    }
    if (filter.regions?.length && !filter.regions.includes(getRegion(station.prefecture))) {
      return false;
    }
    return true;
  });
}

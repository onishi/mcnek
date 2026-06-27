import { REGIONS } from "../types/roadsideStation";
import type { Region, RoadsideStation } from "../types/roadsideStation";
import { getRegion } from "../data/regions";

export function countByRegion(
  stations: RoadsideStation[],
): Record<Region, number> {
  const counts = Object.fromEntries(
    REGIONS.map((region) => [region, 0]),
  ) as Record<Region, number>;

  for (const station of stations) {
    counts[getRegion(station.prefecture)] += 1;
  }

  return counts;
}

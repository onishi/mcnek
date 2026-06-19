import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, RoadsideStation } from "../types/roadsideStation";

export function countByPrefecture(
  stations: RoadsideStation[],
): Record<Prefecture, number> {
  const counts = Object.fromEntries(
    PREFECTURES.map((prefecture) => [prefecture, 0]),
  ) as Record<Prefecture, number>;

  for (const station of stations) {
    counts[station.prefecture] += 1;
  }

  return counts;
}

import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, RoadsideStation } from "../types/roadsideStation";

export function countVisitedByPrefecture(
  stations: RoadsideStation[],
  visitedStationIds: ReadonlySet<string>,
): Record<Prefecture, number> {
  const counts = Object.fromEntries(
    PREFECTURES.map((prefecture) => [prefecture, 0]),
  ) as Record<Prefecture, number>;

  for (const station of stations) {
    if (visitedStationIds.has(station.id)) {
      counts[station.prefecture] += 1;
    }
  }

  return counts;
}

export type OverallVisitStats = {
  totalCount: number;
  visitedCount: number;
  achievementRate: number;
};

export function getOverallVisitStats(
  stations: RoadsideStation[],
  visitedStationIds: ReadonlySet<string>,
): OverallVisitStats {
  const totalCount = stations.length;
  const visitedCount = stations.filter((station) =>
    visitedStationIds.has(station.id),
  ).length;
  const achievementRate =
    totalCount === 0 ? 0 : Math.round((visitedCount / totalCount) * 1000) / 10;

  return { totalCount, visitedCount, achievementRate };
}

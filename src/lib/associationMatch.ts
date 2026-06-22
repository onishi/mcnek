import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, RoadsideStation } from "../types/roadsideStation";

export type PrefectureMatchStat = {
  prefecture: Prefecture;
  matched: number;
  total: number;
};

export function hasAssociationMatch(
  station: Pick<RoadsideStation, "associationSourceUrl">,
): boolean {
  return station.associationSourceUrl !== null;
}

export function findUnmatchedStations(
  stations: RoadsideStation[],
): RoadsideStation[] {
  return stations.filter((station) => !hasAssociationMatch(station));
}

export function computeAssociationMatchByPrefecture(
  stations: RoadsideStation[],
): PrefectureMatchStat[] {
  const stats = new Map<Prefecture, PrefectureMatchStat>(
    PREFECTURES.map((prefecture) => [
      prefecture,
      { prefecture, matched: 0, total: 0 },
    ]),
  );

  for (const station of stations) {
    const stat = stats.get(station.prefecture);
    if (!stat) continue;
    stat.total += 1;
    if (hasAssociationMatch(station)) {
      stat.matched += 1;
    }
  }

  return [...stats.values()];
}

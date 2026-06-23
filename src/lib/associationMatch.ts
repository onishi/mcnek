import { extractMichiNoEkiPath } from "./michiNoEkiUrl";
import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, RoadsideStation } from "../types/roadsideStation";
import type { MichiNoEkiRecord } from "../import/parseMichiNoEkiPage";

export type PrefectureMatchStat = {
  prefecture: Prefecture;
  matched: number;
  total: number;
};

export type PrefectureMatchRow = {
  mlitStation: RoadsideStation | null;
  michiNoEkiRecords: MichiNoEkiRecord[];
};

export type PrefectureMatchGroup = {
  prefecture: Prefecture;
  rows: PrefectureMatchRow[];
};

export function hasAssociationMatch(
  station: Pick<RoadsideStation, "associationSourceUrls">,
): boolean {
  return station.associationSourceUrls.length > 0;
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

function isPrefecture(value: string): value is Prefecture {
  return (PREFECTURES as readonly string[]).includes(value);
}

/** マッチした行を先頭に、紐付けできなかった行をその後ろに並べる */
function byMatchedFirst(a: PrefectureMatchRow, b: PrefectureMatchRow): number {
  const aMatched = a.mlitStation && a.michiNoEkiRecords.length > 0 ? 0 : 1;
  const bMatched = b.mlitStation && b.michiNoEkiRecords.length > 0 ? 0 : 1;
  return aMatched - bMatched;
}

/**
 * 国土交通省データと連絡会データを都道府県ごとにグループ化し、
 * 紐付けできた駅は同じ行に（1対多の場合は連絡会データを複数件並べて）、
 * 紐付けできなかった駅はその後ろに並べる。
 */
export function groupStationsByPrefecture(
  stations: RoadsideStation[],
  records: MichiNoEkiRecord[],
): PrefectureMatchGroup[] {
  const recordByPath = new Map<string, MichiNoEkiRecord>();
  for (const record of records) {
    recordByPath.set(record.stationPath, record);
  }

  const rowsByPrefecture = new Map<Prefecture, PrefectureMatchRow[]>(
    PREFECTURES.map((prefecture) => [prefecture, []]),
  );
  const matchedPaths = new Set<string>();

  for (const station of stations) {
    const rows = rowsByPrefecture.get(station.prefecture);
    if (!rows) continue;

    const michiNoEkiRecords = station.associationSourceUrls
      .map((url) => recordByPath.get(extractMichiNoEkiPath(url)))
      .filter((record): record is MichiNoEkiRecord => record !== undefined);
    for (const record of michiNoEkiRecords) {
      matchedPaths.add(record.stationPath);
    }
    rows.push({ mlitStation: station, michiNoEkiRecords });
  }

  for (const record of records) {
    if (matchedPaths.has(record.stationPath)) continue;
    if (!isPrefecture(record.prefecture)) continue;

    const rows = rowsByPrefecture.get(record.prefecture);
    if (!rows) continue;
    rows.push({ mlitStation: null, michiNoEkiRecords: [record] });
  }

  return PREFECTURES.map((prefecture) => {
    const rows = rowsByPrefecture.get(prefecture) ?? [];
    return { prefecture, rows: [...rows].sort(byMatchedFirst) };
  });
}

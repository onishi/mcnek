import { buildMichiNoEkiUrl } from "../lib/michiNoEkiUrl";
import type { RoadsideStation } from "../types/roadsideStation";
import type { MichiNoEkiRecord } from "./parseMichiNoEkiPage";

/**
 * 全角英数字を半角化し、空白・中点・かっこの表記揺れを統一して
 * 突き合わせ用に正規化する。
 */
export function normalizeStationName(name: string): string {
  return name
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/[\s\u3000]+/g, "")
    .replace(/[・･]/g, "・") // 中点（・/･）を全角の「・」に統一
    .replace(/[「『]/g, "「") // かっこ開き（「/『）を「に統一
    .replace(/[」』]/g, "」") // かっこ閉じ（」/』）を」に統一
    .trim();
}

function buildMatchKey(prefecture: string, name: string): string {
  return `${prefecture}:${normalizeStationName(name)}`;
}

export type MatchMichiNoEkiResult = {
  stations: RoadsideStation[];
  unmatchedStations: RoadsideStation[];
};

export function matchMichiNoEkiStations(
  stations: RoadsideStation[],
  records: MichiNoEkiRecord[],
): MatchMichiNoEkiResult {
  const recordByKey = new Map<string, MichiNoEkiRecord>();
  for (const record of records) {
    recordByKey.set(buildMatchKey(record.prefecture, record.name), record);
  }

  const unmatchedStations: RoadsideStation[] = [];
  const matchedStations = stations.map((station) => {
    const record = recordByKey.get(
      buildMatchKey(station.prefecture, station.name),
    );
    if (!record) {
      unmatchedStations.push(station);
      return station;
    }

    return {
      ...station,
      associationSourceUrls: [buildMichiNoEkiUrl(record.stationPath)],
    };
  });

  return { stations: matchedStations, unmatchedStations };
}

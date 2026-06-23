import { createHash } from "node:crypto";
import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, RoadsideStation } from "../types/roadsideStation";
import type { MlitStationRecord } from "./parseMlitStations";

const MLIT_LIST_URL = "https://www.mlit.go.jp/road/Michi-no-Eki/list.html";

/** 元号の開始年の前年。実際の西暦 = ERA_START_YEAR[元号] + 元号年。 */
const ERA_START_YEAR: Record<string, number> = {
  S: 1925,
  H: 1988,
  R: 2018,
};

function isPrefecture(value: string): value is Prefecture {
  return (PREFECTURES as readonly string[]).includes(value);
}

function toPrefecture(value: string): Prefecture {
  if (!isPrefecture(value)) {
    throw new Error(`未知の都道府県名です: ${value}`);
  }
  return value;
}

function normalizeRegistrationRound(value: string): number | null {
  const match = /^第(\d+)回$/.exec(value);
  return match ? Number(match[1]) : null;
}

function normalizeRegistrationDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = /^([SHR])(\d+)\.(\d+)$/.exec(value);
  if (!match) {
    throw new Error(`登録年月の形式が不正です: ${value}`);
  }

  const [, era, eraYearText, monthText] = match;
  const year = ERA_START_YEAR[era] + Number(eraYearText);
  const month = String(Number(monthText)).padStart(2, "0");
  return `${year}-${month}`;
}

function generateStationId(prefecture: string, name: string): string {
  return createHash("sha1")
    .update(`${prefecture}:${name}`)
    .digest("hex")
    .slice(0, 12);
}

export function normalizeMlitStation(
  record: MlitStationRecord,
  updatedAt: string,
): RoadsideStation {
  const prefecture = toPrefecture(record.prefecture);

  return {
    id: generateStationId(record.prefecture, record.name),
    name: record.name,
    prefecture,
    municipality: record.municipality,
    address: `${prefecture}${record.municipality}`,
    registrationRound: normalizeRegistrationRound(record.registrationRound),
    registrationDate: normalizeRegistrationDate(record.registrationDate),
    latitude: null,
    longitude: null,
    mlitSourceUrl: MLIT_LIST_URL,
    associationSourceUrls: [],
    updatedAt,
  };
}

export function normalizeMlitStations(
  records: MlitStationRecord[],
  updatedAt: string,
): RoadsideStation[] {
  return records.map((record) => normalizeMlitStation(record, updatedAt));
}

export function findDuplicateStationIds(stations: RoadsideStation[]): string[] {
  const countById = new Map<string, number>();
  for (const station of stations) {
    countById.set(station.id, (countById.get(station.id) ?? 0) + 1);
  }

  return [...countById.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}

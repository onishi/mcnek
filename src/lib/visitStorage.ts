import type { RoadsideStation, VisitRecord } from "../types/roadsideStation";

const STORAGE_KEY = "mcnek:visitRecords";

function readVisitRecords(): VisitRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeVisitRecords(records: VisitRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getVisitedStationIds(): string[] {
  return readVisitRecords().map((record) => record.stationId);
}

export function isStationVisited(stationId: string): boolean {
  return readVisitRecords().some((record) => record.stationId === stationId);
}

export function setStationVisited(
  stationId: string,
  visited: boolean,
): VisitRecord[] {
  const records = readVisitRecords();
  const withoutStation = records.filter(
    (record) => record.stationId !== stationId,
  );

  if (!visited) {
    writeVisitRecords(withoutStation);
    return withoutStation;
  }

  const now = new Date().toISOString();
  const updated = [
    ...withoutStation,
    { stationId, visitedAt: now, memo: null, createdAt: now, updatedAt: now },
  ];
  writeVisitRecords(updated);
  return updated;
}

export function filterByVisited(
  stations: RoadsideStation[],
  visitedStationIds: ReadonlySet<string>,
  visitedOnly: boolean,
): RoadsideStation[] {
  if (!visitedOnly) {
    return stations;
  }
  return stations.filter((station) => visitedStationIds.has(station.id));
}

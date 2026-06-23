import type { ManualMichiNoEkiLink } from "./manualMichiNoEkiLinks";

const STORAGE_KEY = "mcnek:manualMichiNoEkiLinks";

export type ManualLinkDraftMap = Record<string, string[]>;

function readDraftMap(): ManualLinkDraftMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ManualLinkDraftMap) : {};
  } catch {
    return {};
  }
}

function writeDraftMap(map: ManualLinkDraftMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getAllManualLinkDrafts(): ManualLinkDraftMap {
  return readDraftMap();
}

export function setManualLinkDraft(
  mlitStationId: string,
  stationPaths: string[],
): void {
  const map = readDraftMap();
  if (stationPaths.length === 0) {
    delete map[mlitStationId];
  } else {
    map[mlitStationId] = stationPaths;
  }
  writeDraftMap(map);
}

export function exportManualLinkDrafts(): ManualMichiNoEkiLink[] {
  return Object.entries(readDraftMap()).map(
    ([mlitStationId, stationPaths]) => ({
      mlitStationId,
      stationPaths,
    }),
  );
}

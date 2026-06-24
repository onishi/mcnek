import type { ManualMichiNoEkiLink } from "../lib/manualMichiNoEkiLinks";
import type { RoadsideStation } from "../types/roadsideStation";
import type { MichiNoEkiRecord } from "./parseMichiNoEkiPage";

export type ManualLinksValidationResult = {
  unknownStationIds: string[];
  unknownStationPaths: string[];
};

export function validateManualMichiNoEkiLinks(
  manualLinks: ManualMichiNoEkiLink[],
  stations: RoadsideStation[],
  records: MichiNoEkiRecord[],
): ManualLinksValidationResult {
  const stationIds = new Set(stations.map((station) => station.id));
  const stationPaths = new Set(records.map((record) => record.stationPath));

  const unknownStationIds: string[] = [];
  const unknownStationPaths: string[] = [];

  for (const link of manualLinks) {
    if (!stationIds.has(link.mlitStationId)) {
      unknownStationIds.push(link.mlitStationId);
    }
    for (const path of link.stationPaths) {
      if (!stationPaths.has(path)) {
        unknownStationPaths.push(path);
      }
    }
  }

  return { unknownStationIds, unknownStationPaths };
}

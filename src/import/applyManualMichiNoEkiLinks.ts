import { buildMichiNoEkiUrl } from "../lib/michiNoEkiUrl";
import type { ManualMichiNoEkiLink } from "../lib/manualMichiNoEkiLinks";
import type { RoadsideStation } from "../types/roadsideStation";

export function applyManualMichiNoEkiLinks(
  stations: RoadsideStation[],
  manualLinks: ManualMichiNoEkiLink[],
): RoadsideStation[] {
  const pathsByStationId = new Map<string, string[]>();
  for (const link of manualLinks) {
    pathsByStationId.set(link.mlitStationId, link.stationPaths);
  }

  return stations.map((station) => {
    const manualPaths = pathsByStationId.get(station.id);
    if (!manualPaths || manualPaths.length === 0) {
      return station;
    }

    const urls = new Set(station.associationSourceUrls);
    for (const path of manualPaths) {
      urls.add(buildMichiNoEkiUrl(path));
    }

    return { ...station, associationSourceUrls: [...urls] };
  });
}

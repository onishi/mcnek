import type { RoadsideStation } from "../types/roadsideStation";

export type StationSummary = {
  id: string;
  name: string;
  prefecture: string;
  municipality: string;
};

export type RenamedStation = {
  id: string;
  previousName: string;
  currentName: string;
  prefecture: string;
  municipality: string;
};

export type AddressChangedStation = {
  id: string;
  name: string;
  previousAddress: string;
  currentAddress: string;
};

export type MlitStationsDiff = {
  added: StationSummary[];
  removed: StationSummary[];
  renamed: RenamedStation[];
  addressChanged: AddressChangedStation[];
};

function toSummary(station: RoadsideStation): StationSummary {
  return {
    id: station.id,
    name: station.name,
    prefecture: station.prefecture,
    municipality: station.municipality,
  };
}

/** 駅名が変わるとIDも変わるため、登録回＋都道府県＋市区町村を手がかりに前回データと突き合わせる */
function buildMatchKey(station: RoadsideStation): string {
  return `${station.prefecture}:${station.municipality}:${station.registrationRound}`;
}

export function diffMlitStations(
  previous: RoadsideStation[],
  current: RoadsideStation[],
): MlitStationsDiff {
  const previousByKey = new Map<string, RoadsideStation[]>();
  for (const station of previous) {
    const key = buildMatchKey(station);
    previousByKey.set(key, [...(previousByKey.get(key) ?? []), station]);
  }

  const matchedPreviousIds = new Set<string>();
  const added: StationSummary[] = [];
  const renamed: RenamedStation[] = [];
  const addressChanged: AddressChangedStation[] = [];

  for (const currentStation of current) {
    const candidates = previousByKey.get(buildMatchKey(currentStation)) ?? [];
    const unmatchedCandidates = candidates.filter(
      (candidate) => !matchedPreviousIds.has(candidate.id),
    );
    const match =
      unmatchedCandidates.find(
        (candidate) => candidate.name === currentStation.name,
      ) ?? unmatchedCandidates[0];

    if (!match) {
      added.push(toSummary(currentStation));
      continue;
    }

    matchedPreviousIds.add(match.id);

    if (match.name !== currentStation.name) {
      renamed.push({
        id: currentStation.id,
        previousName: match.name,
        currentName: currentStation.name,
        prefecture: currentStation.prefecture,
        municipality: currentStation.municipality,
      });
    } else if (match.address !== currentStation.address) {
      addressChanged.push({
        id: currentStation.id,
        name: currentStation.name,
        previousAddress: match.address,
        currentAddress: currentStation.address,
      });
    }
  }

  const removed = previous
    .filter((station) => !matchedPreviousIds.has(station.id))
    .map(toSummary);

  return { added, removed, renamed, addressChanged };
}

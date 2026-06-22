import { readFile, writeFile } from "node:fs/promises";
import type { RoadsideStation } from "../types/roadsideStation";
import { matchMichiNoEkiStations } from "./matchMichiNoEkiStations";
import type { MichiNoEkiRecord } from "./parseMichiNoEkiPage";

const STATIONS_PATH = "src/data/generated/mlitStations.json";
const MICHI_NO_EKI_PATH = "data/raw/michinoeki-stations.json";
const MICHI_NO_EKI_GENERATED_PATH =
  "src/data/generated/michiNoEkiStations.json";

async function main() {
  const stations = JSON.parse(
    await readFile(STATIONS_PATH, "utf-8"),
  ) as RoadsideStation[];
  const records = JSON.parse(
    await readFile(MICHI_NO_EKI_PATH, "utf-8"),
  ) as MichiNoEkiRecord[];

  const { stations: merged, unmatchedStations } = matchMichiNoEkiStations(
    stations,
    records,
  );

  await writeFile(STATIONS_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  await writeFile(
    MICHI_NO_EKI_GENERATED_PATH,
    `${JSON.stringify(records, null, 2)}\n`,
  );

  console.log(
    `突き合わせ件数: ${merged.length - unmatchedStations.length} / ${merged.length}`,
  );
  if (unmatchedStations.length > 0) {
    console.warn(`突き合わせできなかった駅 (${unmatchedStations.length}件):`);
    for (const station of unmatchedStations) {
      console.warn(`  ${station.prefecture} ${station.name}`);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

import { readFile, stat, writeFile } from "node:fs/promises";
import type { RoadsideStation } from "../types/roadsideStation";
import type { ManualMichiNoEkiLink } from "../lib/manualMichiNoEkiLinks";
import type { ImportMeta } from "../lib/importMeta";
import { applyManualMichiNoEkiLinks } from "./applyManualMichiNoEkiLinks";
import { matchMichiNoEkiStations } from "./matchMichiNoEkiStations";
import type { MichiNoEkiRecord } from "./parseMichiNoEkiPage";

const STATIONS_PATH = "src/data/generated/mlitStations.json";
const MICHI_NO_EKI_PATH = "data/raw/michinoeki-stations.json";
const MICHI_NO_EKI_GENERATED_PATH =
  "src/data/generated/michiNoEkiStations.json";
const MANUAL_LINKS_PATH = "data/manual/michiNoEkiManualLinks.json";
const IMPORT_META_PATH = "src/data/generated/importMeta.json";

async function readImportMeta(): Promise<ImportMeta> {
  try {
    return JSON.parse(await readFile(IMPORT_META_PATH, "utf-8")) as ImportMeta;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { mlit: null, michinoeki: null };
    }
    throw error;
  }
}

async function readManualLinks(): Promise<ManualMichiNoEkiLink[]> {
  try {
    return JSON.parse(
      await readFile(MANUAL_LINKS_PATH, "utf-8"),
    ) as ManualMichiNoEkiLink[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function main() {
  const stations = JSON.parse(
    await readFile(STATIONS_PATH, "utf-8"),
  ) as RoadsideStation[];
  const records = JSON.parse(
    await readFile(MICHI_NO_EKI_PATH, "utf-8"),
  ) as MichiNoEkiRecord[];
  const manualLinks = await readManualLinks();

  const { stations: autoMatched } = matchMichiNoEkiStations(
    stations,
    records,
  );
  const merged = applyManualMichiNoEkiLinks(autoMatched, manualLinks);
  const unmatchedStations = merged.filter(
    (station) => station.associationSourceUrls.length === 0,
  );

  await writeFile(STATIONS_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  await writeFile(
    MICHI_NO_EKI_GENERATED_PATH,
    `${JSON.stringify(records, null, 2)}\n`,
  );

  const rawFileStat = await stat(MICHI_NO_EKI_PATH);
  const meta = await readImportMeta();
  meta.michinoeki = {
    fetchedAt: rawFileStat.mtime.toISOString(),
    count: records.length,
  };
  await writeFile(IMPORT_META_PATH, `${JSON.stringify(meta, null, 2)}\n`);

  console.log(
    `突き合わせ件数: ${merged.length - unmatchedStations.length} / ${merged.length}` +
      `（手動紐付け ${manualLinks.length} 件を含む）`,
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

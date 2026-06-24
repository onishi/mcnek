import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parseMlitStationsWorkbook } from "./parseMlitStations";
import {
  findDuplicateStationIds,
  normalizeMlitStations,
} from "./normalizeMlitStations";
import { diffMlitStations } from "./diffMlitStations";
import type { ImportMeta } from "../lib/importMeta";
import type { RoadsideStation } from "../types/roadsideStation";

const INPUT_PATH = "data/raw/mlit-list.xls";
const OUTPUT_PATH = "src/data/generated/mlitStations.json";
const DIFF_OUTPUT_PATH = "src/data/generated/mlitStationsDiff.json";
const IMPORT_META_PATH = "src/data/generated/importMeta.json";

async function readPreviousStations(): Promise<RoadsideStation[]> {
  try {
    return JSON.parse(await readFile(OUTPUT_PATH, "utf-8")) as RoadsideStation[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

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

async function main() {
  const buffer = await readFile(INPUT_PATH);
  const records = parseMlitStationsWorkbook(buffer);
  const fetchedAt = new Date().toISOString();
  const stations = normalizeMlitStations(records, fetchedAt);

  const duplicateIds = findDuplicateStationIds(stations);
  if (duplicateIds.length > 0) {
    console.warn(`重複IDを検出しました: ${duplicateIds.join(", ")}`);
  }

  const previousStations = await readPreviousStations();
  const diff = diffMlitStations(previousStations, stations);

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(stations, null, 2)}\n`);
  await writeFile(DIFF_OUTPUT_PATH, `${JSON.stringify(diff, null, 2)}\n`);

  const meta = await readImportMeta();
  meta.mlit = { fetchedAt, count: stations.length };
  await writeFile(IMPORT_META_PATH, `${JSON.stringify(meta, null, 2)}\n`);

  console.log(`取り込み件数: ${stations.length} 件`);
  console.log(`出力先: ${OUTPUT_PATH}`);
  console.log(
    `差分: 新規登録 ${diff.added.length} 件 / 廃止 ${diff.removed.length} 件 / ` +
      `名称変更 ${diff.renamed.length} 件 / 所在地変更 ${diff.addressChanged.length} 件`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

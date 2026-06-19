import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parseMlitStationsWorkbook } from "./parseMlitStations";
import {
  findDuplicateStationIds,
  normalizeMlitStations,
} from "./normalizeMlitStations";

const INPUT_PATH = "data/raw/mlit-list.xls";
const OUTPUT_PATH = "src/data/generated/mlitStations.json";

async function main() {
  const buffer = await readFile(INPUT_PATH);
  const records = parseMlitStationsWorkbook(buffer);
  const stations = normalizeMlitStations(records, new Date().toISOString());

  const duplicateIds = findDuplicateStationIds(stations);
  if (duplicateIds.length > 0) {
    console.warn(`重複IDを検出しました: ${duplicateIds.join(", ")}`);
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(stations, null, 2)}\n`);

  console.log(`取り込み件数: ${stations.length} 件`);
  console.log(`出力先: ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

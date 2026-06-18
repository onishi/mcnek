import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const MLIT_XLS_URL = "https://www.mlit.go.jp/road/Michi-no-Eki/file/list.xls";
const OUTPUT_PATH = "data/raw/mlit-list.xls";

async function main() {
  const response = await fetch(MLIT_XLS_URL);
  if (!response.ok) {
    throw new Error(
      `XLSの取得に失敗しました: ${response.status} ${response.statusText}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, buffer);
  console.log(`保存しました: ${OUTPUT_PATH} (${buffer.byteLength} bytes)`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

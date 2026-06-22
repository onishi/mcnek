import { mkdir, writeFile } from "node:fs/promises";
import { parseMichiNoEkiPage, type MichiNoEkiRecord } from "./parseMichiNoEkiPage";

const BASE_URL =
  "https://www.michi-no-eki.jp/stations/search/all/all/all";
const OUTPUT_PATH = "data/raw/michinoeki-stations.json";
const DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(page: number): Promise<string> {
  const url = page === 0 ? BASE_URL : `${BASE_URL}?page=${page}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `ページ取得失敗 (page=${page}): ${response.status} ${response.statusText}`,
    );
  }
  return response.text();
}

function detectLastPage(html: string): number {
  // 「最後 »」リンクの page= 値を探す
  const match = /\/stations\/search\/all\/all\/all\?page=(\d+)[^"]*"[^>]*>[^<]*»/.exec(html);
  return match ? Number(match[1]) : 0;
}

async function main() {
  console.log("1ページ目を取得中...");
  const firstHtml = await fetchPage(0);
  const firstRecords = parseMichiNoEkiPage(firstHtml);
  const lastPage = detectLastPage(firstHtml);

  console.log(
    `1ページ目: ${firstRecords.length}件 / 総ページ数: ${lastPage + 1}ページ`,
  );

  const allRecords: MichiNoEkiRecord[] = [...firstRecords];

  for (let page = 1; page <= lastPage; page++) {
    await sleep(DELAY_MS);
    const html = await fetchPage(page);
    const records = parseMichiNoEkiPage(html);
    allRecords.push(...records);
    process.stdout.write(
      `\rページ ${page + 1}/${lastPage + 1}: 累計 ${allRecords.length}件`,
    );
  }

  console.log();
  await mkdir("data/raw", { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(allRecords, null, 2)}\n`);
  console.log(`\n合計 ${allRecords.length}件 -> ${OUTPUT_PATH}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

import { mkdir, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const BASE_URL = "https://www.michi-no-eki.jp";
const INPUT_PATH = "data/raw/michinoeki-stations.json";
const OUTPUT_PATH = "data/raw/michinoeki-addresses.json";
const DELAY_MS = 1000;

type MichiNoEkiRaw = {
  name: string;
  prefecture: string;
  municipality: string;
  stationPath: string;
};

export type MichiNoEkiAddress = {
  stationPath: string;
  address: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseAddress(html: string): string | null {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // <dt>所在地</dt> の次の <dd> を取得
  const dts = document.querySelectorAll("dt");
  for (const dt of dts) {
    if (dt.textContent?.trim() === "所在地") {
      const dd = dt.nextElementSibling;
      if (dd?.tagName === "DD") {
        const raw = dd.textContent?.trim() ?? "";
        // 郵便番号 "NNN-NNNN " を除去
        return raw.replace(/^\d{3}-\d{4}\s*/, "").trim();
      }
    }
  }
  return null;
}

async function main() {
  const { readFile } = await import("node:fs/promises");
  const stations: MichiNoEkiRaw[] = JSON.parse(
    await readFile(INPUT_PATH, "utf-8"),
  );

  console.log(`${stations.length} 件の詳細ページを取得します（約 ${Math.ceil(stations.length / 60)} 分）`);

  const results: MichiNoEkiAddress[] = [];
  let failed = 0;

  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    const url = `${BASE_URL}${station.stationPath}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const address = parseAddress(html);

      if (address) {
        results.push({ stationPath: station.stationPath, address });
      } else {
        console.warn(`\n住所未取得: ${station.name} (${url})`);
        failed++;
      }
    } catch (err) {
      console.warn(`\n取得失敗: ${station.name} - ${String(err)}`);
      failed++;
    }

    process.stdout.write(
      `\r${i + 1}/${stations.length} 件処理済み（失敗: ${failed}）`,
    );

    if (i < stations.length - 1) await sleep(DELAY_MS);
  }

  console.log();
  await mkdir("data/raw", { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`\n${results.length} 件 -> ${OUTPUT_PATH}（失敗: ${failed} 件）`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

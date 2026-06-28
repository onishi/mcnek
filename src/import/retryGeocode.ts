// 座標未取得の駅に対して住所を修正して GSI API を再試行するスクリプト
import { readFile, writeFile } from "node:fs/promises";
import type { RoadsideStation } from "../types/roadsideStation";
import type { MichiNoEkiAddress } from "./fetchMichiNoEkiAddresses";

const STATIONS_PATH = "src/data/generated/mlitStations.json";
const ADDRESSES_PATH = "data/raw/michinoeki-addresses.json";
const GSI_API = "https://msearch.gsi.go.jp/address-search/AddressSearch";
const DELAY_MS = 500;

type GsiFeature = {
  geometry: { coordinates: [number, number] };
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `${GSI_API}?q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GSI API エラー: ${response.status}`);
  const features = (await response.json()) as GsiFeature[];
  if (!features.length) return null;
  const [lon, lat] = features[0].geometry.coordinates;
  return { lat, lon };
}

// 住所文字列を正規化して複数の候補を返す
function normalizeVariants(raw: string): string[] {
  const variants: string[] = [];

  // 1. 全角ハイフンを含む郵便番号 (例: 368－0201 → 除去)
  const withoutZenPostal = raw.replace(/^\d{3}[－-]\d{3,4}\s*/, "");

  // 2. ハイフンなし7桁郵便番号 (例: 7390041 → 除去)
  const withoutNoHyphenPostal = raw.replace(/^\d{7}\s*/, "");

  // 3. 「郡」→「県」の修正 (例: 岩手郡 → 岩手県)
  const fixedKen = withoutZenPostal.replace(/^(\S{2})郡/, "$1県");

  for (const candidate of [withoutZenPostal, withoutNoHyphenPostal, fixedKen, raw]) {
    const trimmed = candidate.trim();
    if (trimmed && !variants.includes(trimmed)) {
      variants.push(trimmed);
    }
  }

  return variants;
}

async function main() {
  const stations = JSON.parse(
    await readFile(STATIONS_PATH, "utf-8"),
  ) as RoadsideStation[];

  const addresses = JSON.parse(
    await readFile(ADDRESSES_PATH, "utf-8"),
  ) as MichiNoEkiAddress[];

  const addressByPath = new Map(addresses.map((a) => [a.stationPath, a.address]));

  const noCoords = stations.filter((s) => s.latitude === null);
  console.log(`座標未取得: ${noCoords.length} 件\n`);

  const updated = new Map<string, { lat: number; lon: number }>();

  for (const station of noCoords) {
    const path = station.associationSourceUrls[0]?.replace(
      "https://www.michi-no-eki.jp",
      "",
    );
    const rawAddress = path ? addressByPath.get(path) : undefined;

    if (!rawAddress) {
      console.log(`✗ ${station.name}: 住所データなし`);
      continue;
    }

    const variants = normalizeVariants(rawAddress);
    let found = false;

    for (const address of variants) {
      await sleep(DELAY_MS);
      try {
        const coords = await geocode(address);
        if (coords) {
          updated.set(station.id, coords);
          console.log(`✓ ${station.name}: "${address}" → ${coords.lat}, ${coords.lon}`);
          found = true;
          break;
        } else {
          console.log(`  試行: "${address}" → 結果なし`);
        }
      } catch (err) {
        console.log(`  試行: "${address}" → エラー: ${String(err)}`);
      }
    }

    if (!found) {
      console.log(`✗ ${station.name}: すべての候補で取得できず（元の住所: "${rawAddress}"）`);
    }
  }

  if (updated.size === 0) {
    console.log("\n更新なし");
    return;
  }

  const result = stations.map((s) => {
    const coords = updated.get(s.id);
    return coords ? { ...s, latitude: coords.lat, longitude: coords.lon } : s;
  });

  await writeFile(STATIONS_PATH, `${JSON.stringify(result, null, 2)}\n`);
  const total = result.filter((s) => s.latitude !== null).length;
  console.log(`\n${updated.size} 件更新 → 合計 ${total}/${result.length} 件が座標あり`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

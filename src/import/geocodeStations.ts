import { readFile, writeFile } from "node:fs/promises";
import type { RoadsideStation } from "../types/roadsideStation";
import type { MichiNoEkiAddress } from "./fetchMichiNoEkiAddresses";

const STATIONS_PATH = "src/data/generated/mlitStations.json";
const ADDRESSES_PATH = "data/raw/michinoeki-addresses.json";
const GSI_API = "https://msearch.gsi.go.jp/address-search/AddressSearch";
const DELAY_MS = 300;

type GsiFeature = {
  geometry: { coordinates: [number, number] };
  properties: { title: string };
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

async function main() {
  const stations = JSON.parse(
    await readFile(STATIONS_PATH, "utf-8"),
  ) as RoadsideStation[];

  const addresses = JSON.parse(
    await readFile(ADDRESSES_PATH, "utf-8"),
  ) as MichiNoEkiAddress[];

  // stationPath → address のマップ
  const addressByPath = new Map(addresses.map((a) => [a.stationPath, a.address]));

  // associationSourceUrl から stationPath を取り出してマッチング
  const stationMap = new Map<string, RoadsideStation>();
  for (const station of stations) {
    for (const url of station.associationSourceUrls) {
      const path = url.replace("https://www.michi-no-eki.jp", "");
      stationMap.set(path, station);
    }
  }

  const updated = new Map<string, { lat: number; lon: number }>();
  let success = 0;
  let notFound = 0;
  let failed = 0;
  let i = 0;

  for (const [path, address] of addressByPath) {
    const station = stationMap.get(path);
    if (!station) {
      i++;
      continue;
    }

    // すでに座標がある場合はスキップ
    if (station.latitude !== null && station.longitude !== null) {
      i++;
      success++;
      continue;
    }

    try {
      const coords = await geocode(address);
      if (coords) {
        updated.set(station.id, coords);
        success++;
      } else {
        console.warn(`\n座標未取得: ${station.name} (${address})`);
        notFound++;
      }
    } catch (err) {
      console.warn(`\nジオコーディング失敗: ${station.name} - ${String(err)}`);
      failed++;
    }

    i++;
    process.stdout.write(`\r${i}/${addressByPath.size} 件処理済み（成功: ${success}, 未取得: ${notFound}, 失敗: ${failed}）`);

    if (i < addressByPath.size) await sleep(DELAY_MS);
  }

  console.log();

  // mlitStations.json を更新
  const result = stations.map((s) => {
    const coords = updated.get(s.id);
    if (!coords) return s;
    return { ...s, latitude: coords.lat, longitude: coords.lon };
  });

  await writeFile(STATIONS_PATH, `${JSON.stringify(result, null, 2)}\n`);

  const withCoords = result.filter((s) => s.latitude !== null).length;
  console.log(`座標更新: ${updated.size} 件 / 全体 ${result.length} 件中 ${withCoords} 件が座標あり`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

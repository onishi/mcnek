import { filterStations } from "../../src/lib/filterStations";
import type { RoadsideStation } from "../../src/types/roadsideStation";

const stations: RoadsideStation[] = [
  {
    id: "a",
    name: "川場田園プラザ",
    prefecture: "群馬県",
    municipality: "川場村",
    address: "群馬県利根郡川場村萩室385",
    registrationRound: 1,
    registrationDate: "1993-04",
    latitude: 36.6939,
    longitude: 139.1486,
    mlitSourceUrl: "https://example.com",
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "b",
    name: "とようら",
    prefecture: "北海道",
    municipality: "豊浦町",
    address: "北海道虻田郡豊浦町字礫岩133-2",
    registrationRound: 6,
    registrationDate: "1996-08",
    latitude: 42.6447,
    longitude: 140.4097,
    mlitSourceUrl: "https://example.com",
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "c",
    name: "遠野風の丘",
    prefecture: "岩手県",
    municipality: "遠野市",
    address: "岩手県遠野市風呼43-1",
    registrationRound: 14,
    registrationDate: "1998-04",
    latitude: 39.3486,
    longitude: 141.5719,
    mlitSourceUrl: "https://example.com",
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

test("フィルターなしではすべての駅を返す", () => {
  expect(filterStations(stations, {})).toHaveLength(3);
});

test("駅名の部分一致で検索できる", () => {
  const result = filterStations(stations, { query: "風の丘" });
  expect(result.map((s) => s.id)).toEqual(["c"]);
});

test("駅名検索の前後の空白は無視される", () => {
  const result = filterStations(stations, { query: "  風の丘  " });
  expect(result.map((s) => s.id)).toEqual(["c"]);
});

test("都道府県で絞り込める", () => {
  const result = filterStations(stations, { prefectures: ["北海道"] });
  expect(result.map((s) => s.id)).toEqual(["b"]);
});

test("都道府県を複数選択して絞り込める", () => {
  const result = filterStations(stations, { prefectures: ["北海道", "岩手県"] });
  expect(result.map((s) => s.id)).toEqual(["b", "c"]);
});

test("地方で絞り込める", () => {
  const result = filterStations(stations, { regions: ["東北地方"] });
  expect(result.map((s) => s.id)).toEqual(["c"]);
});

test("地方を複数選択して絞り込める", () => {
  const result = filterStations(stations, { regions: ["北海道地方", "東北地方"] });
  expect(result.map((s) => s.id)).toEqual(["b", "c"]);
});

test("複数条件を組み合わせて絞り込める", () => {
  const result = filterStations(stations, {
    query: "とようら",
    prefectures: ["北海道"],
  });
  expect(result.map((s) => s.id)).toEqual(["b"]);
});

test("条件に一致しない場合は空配列を返す", () => {
  const result = filterStations(stations, { query: "存在しない駅名" });
  expect(result).toEqual([]);
});

test("都道府県と地方が矛盾する場合は空配列を返す", () => {
  const result = filterStations(stations, {
    prefectures: ["北海道"],
    regions: ["東北地方"],
  });
  expect(result).toEqual([]);
});

import {
  findDuplicateStationIds,
  normalizeMlitStation,
  normalizeMlitStations,
} from "../../src/import/normalizeMlitStations";
import type { MlitStationRecord } from "../../src/import/parseMlitStations";

const baseRecord: MlitStationRecord = {
  prefecture: "群馬県",
  name: "川場田園プラザ",
  registrationRound: "第1回",
  registrationDate: "H5.4",
  municipality: "利根郡川場村",
};

test("都道府県・市区町村をそのまま反映する", () => {
  const station = normalizeMlitStation(baseRecord, "2026-01-01T00:00:00.000Z");
  expect(station.prefecture).toBe("群馬県");
  expect(station.municipality).toBe("利根郡川場村");
  expect(station.address).toBe("群馬県利根郡川場村");
});

test("登録回を数値に変換する", () => {
  const station = normalizeMlitStation(
    { ...baseRecord, registrationRound: "第55回" },
    "2026-01-01T00:00:00.000Z",
  );
  expect(station.registrationRound).toBe(55);
});

test("登録回が想定外の形式なら null になる", () => {
  const station = normalizeMlitStation(
    { ...baseRecord, registrationRound: "" },
    "2026-01-01T00:00:00.000Z",
  );
  expect(station.registrationRound).toBeNull();
});

test.each([
  ["H5.4", "1993-04"],
  ["H10.8", "1998-08"],
  ["R3.6", "2021-06"],
  ["S63.12", "1988-12"],
])("登録年月 %s を %s に変換する", (input, expected) => {
  const station = normalizeMlitStation(
    { ...baseRecord, registrationDate: input },
    "2026-01-01T00:00:00.000Z",
  );
  expect(station.registrationDate).toBe(expected);
});

test("登録年月が null の場合は null のままになる", () => {
  const station = normalizeMlitStation(
    { ...baseRecord, registrationDate: null },
    "2026-01-01T00:00:00.000Z",
  );
  expect(station.registrationDate).toBeNull();
});

test("登録年月の形式が不正な場合はエラーになる", () => {
  expect(() =>
    normalizeMlitStation(
      { ...baseRecord, registrationDate: "2021年6月" },
      "2026-01-01T00:00:00.000Z",
    ),
  ).toThrow();
});

test("未知の都道府県名はエラーになる", () => {
  expect(() =>
    normalizeMlitStation(
      { ...baseRecord, prefecture: "群馬" },
      "2026-01-01T00:00:00.000Z",
    ),
  ).toThrow();
});

test("同じ都道府県・駅名からは同じIDが生成される", () => {
  const a = normalizeMlitStation(baseRecord, "2026-01-01T00:00:00.000Z");
  const b = normalizeMlitStation(baseRecord, "2026-02-01T00:00:00.000Z");
  expect(a.id).toBe(b.id);
});

test("駅名が異なれば異なるIDが生成される", () => {
  const a = normalizeMlitStation(baseRecord, "2026-01-01T00:00:00.000Z");
  const b = normalizeMlitStation(
    { ...baseRecord, name: "別の道の駅" },
    "2026-01-01T00:00:00.000Z",
  );
  expect(a.id).not.toBe(b.id);
});

test("複数件をまとめて正規化できる", () => {
  const stations = normalizeMlitStations(
    [baseRecord, { ...baseRecord, name: "別の道の駅" }],
    "2026-01-01T00:00:00.000Z",
  );
  expect(stations).toHaveLength(2);
});

test("重複IDを検出する", () => {
  const stations = normalizeMlitStations(
    [baseRecord, baseRecord],
    "2026-01-01T00:00:00.000Z",
  );
  expect(findDuplicateStationIds(stations)).toEqual([stations[0].id]);
});

test("重複がない場合は空配列になる", () => {
  const stations = normalizeMlitStations(
    [baseRecord, { ...baseRecord, name: "別の道の駅" }],
    "2026-01-01T00:00:00.000Z",
  );
  expect(findDuplicateStationIds(stations)).toEqual([]);
});

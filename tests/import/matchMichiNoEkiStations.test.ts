import {
  matchMichiNoEkiStations,
  normalizeStationName,
} from "../../src/import/matchMichiNoEkiStations";
import type { MichiNoEkiRecord } from "../../src/import/parseMichiNoEkiPage";
import type { RoadsideStation } from "../../src/types/roadsideStation";

const baseStation: RoadsideStation = {
  id: "abc123",
  name: "川場田園プラザ",
  prefecture: "群馬県",
  municipality: "利根郡川場村",
  address: "群馬県利根郡川場村",
  registrationRound: 1,
  registrationDate: "1993-04",
  latitude: null,
  longitude: null,
  mlitSourceUrl: "https://example.com",
  associationSourceUrls: [],
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function buildRecord(
  overrides: Partial<MichiNoEkiRecord> = {},
): MichiNoEkiRecord {
  return {
    name: "川場田園プラザ",
    prefecture: "群馬県",
    municipality: "利根郡川場村",
    stationPath: "/stations/views/1",
    ...overrides,
  };
}

test.each([
  ["ルート２２９元和台", "ルート229元和台"],
  ["遊ＹＯＵさろん東城", "遊YOUさろん東城"],
  ["あいづ　湯川・会津坂下", "あいづ湯川・会津坂下"],
  ["北欧の風 道の駅とうべつ", "北欧の風道の駅とうべつ"],
])("全角英数字と空白の違いを無視して正規化する: %s", (input, expected) => {
  expect(normalizeStationName(input)).toBe(expected);
});

test("半角・全角の中点の違いを無視して正規化する", () => {
  expect(normalizeStationName("伯方Ｓ・Ｃパーク")).toBe(
    normalizeStationName("伯方S･Cパーク"),
  );
});

test("「」と『』のかっこの違いを無視して正規化する", () => {
  expect(normalizeStationName("美里「佐俣の湯」")).toBe(
    normalizeStationName("美里『佐俣の湯』"),
  );
});

test("駅名・都道府県が一致する駅に詳細URLを設定する", () => {
  const { stations, unmatchedStations } = matchMichiNoEkiStations(
    [baseStation],
    [buildRecord()],
  );

  expect(stations[0].associationSourceUrls).toEqual([
    "https://www.michi-no-eki.jp/stations/views/1",
  ]);
  expect(unmatchedStations).toHaveLength(0);
});

test("全角数字や空白の差異があっても一致させる", () => {
  const { stations, unmatchedStations } = matchMichiNoEkiStations(
    [{ ...baseStation, name: "ルート229元和台" }],
    [buildRecord({ name: "ルート２２９元和台" })],
  );

  expect(stations[0].associationSourceUrls).toEqual([
    "https://www.michi-no-eki.jp/stations/views/1",
  ]);
  expect(unmatchedStations).toHaveLength(0);
});

test("一致しない駅は associationSourceUrls を変更せず未一致として返す", () => {
  const { stations, unmatchedStations } = matchMichiNoEkiStations(
    [baseStation],
    [buildRecord({ name: "別の道の駅" })],
  );

  expect(stations[0].associationSourceUrls).toEqual([]);
  expect(unmatchedStations).toEqual([baseStation]);
});

test("都道府県が異なる場合は一致しない", () => {
  const { unmatchedStations } = matchMichiNoEkiStations(
    [baseStation],
    [buildRecord({ prefecture: "栃木県" })],
  );

  expect(unmatchedStations).toEqual([baseStation]);
});

test("入力データを変更せず新しいオブジェクトを返す", () => {
  const input = [baseStation];
  const { stations } = matchMichiNoEkiStations(input, [buildRecord()]);

  expect(baseStation.associationSourceUrls).toEqual([]);
  expect(stations).not.toBe(input);
  expect(stations[0]).not.toBe(baseStation);
});

import {
  computeAssociationMatchByPrefecture,
  findUnmatchedStations,
  groupStationsByPrefecture,
  hasAssociationMatch,
} from "../../src/lib/associationMatch";
import { buildMichiNoEkiUrl } from "../../src/lib/michiNoEkiUrl";
import { PREFECTURES } from "../../src/types/roadsideStation";
import type { RoadsideStation } from "../../src/types/roadsideStation";
import type { MichiNoEkiRecord } from "../../src/import/parseMichiNoEkiPage";

function buildStation(
  overrides: Partial<RoadsideStation> & {
    prefecture: RoadsideStation["prefecture"];
  },
): RoadsideStation {
  return {
    id: "test",
    name: "テスト駅",
    municipality: "テスト市",
    address: "テスト県テスト市",
    registrationRound: null,
    registrationDate: null,
    latitude: null,
    longitude: null,
    mlitSourceUrl: "https://example.com",
    associationSourceUrl: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function buildRecord(
  overrides: Partial<MichiNoEkiRecord> & {
    prefecture: string;
    stationPath: string;
  },
): MichiNoEkiRecord {
  return {
    name: "テスト駅",
    municipality: "テスト市",
    ...overrides,
  };
}

test("associationSourceUrl がある場合は一致とみなす", () => {
  expect(
    hasAssociationMatch(
      buildStation({
        prefecture: "群馬県",
        associationSourceUrl: "https://example.com/1",
      }),
    ),
  ).toBe(true);
});

test("associationSourceUrl が null の場合は未一致とみなす", () => {
  expect(
    hasAssociationMatch(
      buildStation({ prefecture: "群馬県", associationSourceUrl: null }),
    ),
  ).toBe(false);
});

test("未一致の駅だけを抽出する", () => {
  const matched = buildStation({
    prefecture: "群馬県",
    associationSourceUrl: "https://example.com/1",
  });
  const unmatched = buildStation({
    prefecture: "北海道",
    associationSourceUrl: null,
  });

  expect(findUnmatchedStations([matched, unmatched])).toEqual([unmatched]);
});

test("すべての都道府県の集計を 0 件で初期化する", () => {
  const stats = computeAssociationMatchByPrefecture([]);
  expect(stats).toHaveLength(PREFECTURES.length);
  for (const stat of stats) {
    expect(stat).toEqual({ prefecture: stat.prefecture, matched: 0, total: 0 });
  }
});

test("都道府県ごとに一致件数と全件数を集計する", () => {
  const stats = computeAssociationMatchByPrefecture([
    buildStation({
      prefecture: "群馬県",
      associationSourceUrl: "https://example.com/1",
    }),
    buildStation({ prefecture: "群馬県", associationSourceUrl: null }),
    buildStation({
      prefecture: "北海道",
      associationSourceUrl: "https://example.com/2",
    }),
  ]);

  const gunma = stats.find((stat) => stat.prefecture === "群馬県");
  const hokkaido = stats.find((stat) => stat.prefecture === "北海道");
  expect(gunma).toEqual({ prefecture: "群馬県", matched: 1, total: 2 });
  expect(hokkaido).toEqual({ prefecture: "北海道", matched: 1, total: 1 });
});

test("都道府県ごとの行数が 0 件のグループも含めてすべて返す", () => {
  const groups = groupStationsByPrefecture([], []);
  expect(groups).toHaveLength(PREFECTURES.length);
  for (const group of groups) {
    expect(group.rows).toEqual([]);
  }
});

test("紐付けできた駅は同じ行にまとめる", () => {
  const station = buildStation({
    prefecture: "群馬県",
    name: "川場田園プラザ",
    associationSourceUrl: buildMichiNoEkiUrl("/stations/views/1"),
  });
  const record = buildRecord({
    prefecture: "群馬県",
    name: "川場田園プラザ",
    stationPath: "/stations/views/1",
  });

  const groups = groupStationsByPrefecture([station], [record]);
  const gunma = groups.find((group) => group.prefecture === "群馬県");

  expect(gunma?.rows).toEqual([
    { mlitStation: station, michiNoEkiRecord: record },
  ]);
});

test("国土交通省データにしかない駅は連絡会データ側が空の行になる", () => {
  const station = buildStation({
    prefecture: "群馬県",
    associationSourceUrl: null,
  });

  const groups = groupStationsByPrefecture([station], []);
  const gunma = groups.find((group) => group.prefecture === "群馬県");

  expect(gunma?.rows).toEqual([
    { mlitStation: station, michiNoEkiRecord: null },
  ]);
});

test("連絡会データにしかない駅は国土交通省データ側が空の行になる", () => {
  const record = buildRecord({
    prefecture: "群馬県",
    stationPath: "/stations/views/1",
  });

  const groups = groupStationsByPrefecture([], [record]);
  const gunma = groups.find((group) => group.prefecture === "群馬県");

  expect(gunma?.rows).toEqual([
    { mlitStation: null, michiNoEkiRecord: record },
  ]);
});

test("紐付けできた行を先頭に、できなかった行をその後ろに並べる", () => {
  const unmatchedStation = buildStation({
    prefecture: "群馬県",
    name: "未一致駅",
    associationSourceUrl: null,
  });
  const matchedStation = buildStation({
    prefecture: "群馬県",
    name: "一致駅",
    associationSourceUrl: buildMichiNoEkiUrl("/stations/views/1"),
  });
  const matchedRecord = buildRecord({
    prefecture: "群馬県",
    name: "一致駅",
    stationPath: "/stations/views/1",
  });

  const groups = groupStationsByPrefecture(
    [unmatchedStation, matchedStation],
    [matchedRecord],
  );
  const gunma = groups.find((group) => group.prefecture === "群馬県");

  expect(gunma?.rows).toEqual([
    { mlitStation: matchedStation, michiNoEkiRecord: matchedRecord },
    { mlitStation: unmatchedStation, michiNoEkiRecord: null },
  ]);
});

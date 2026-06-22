import {
  computeAssociationMatchByPrefecture,
  findUnmatchedStations,
  hasAssociationMatch,
} from "../../src/lib/associationMatch";
import { PREFECTURES } from "../../src/types/roadsideStation";
import type { RoadsideStation } from "../../src/types/roadsideStation";

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

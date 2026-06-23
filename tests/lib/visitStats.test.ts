import {
  countVisitedByPrefecture,
  getOverallVisitStats,
} from "../../src/lib/visitStats";
import { PREFECTURES } from "../../src/types/roadsideStation";
import type { RoadsideStation } from "../../src/types/roadsideStation";

function buildStation(
  overrides: Partial<RoadsideStation> & {
    id: string;
    prefecture: RoadsideStation["prefecture"];
  },
): RoadsideStation {
  return {
    name: "テスト駅",
    municipality: "テスト市",
    address: "テスト県テスト市",
    registrationRound: null,
    registrationDate: null,
    latitude: null,
    longitude: null,
    mlitSourceUrl: "https://example.com",
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("countVisitedByPrefecture", () => {
  test("すべての都道府県のキーを 0 件で初期化する", () => {
    const counts = countVisitedByPrefecture([], new Set());
    for (const prefecture of PREFECTURES) {
      expect(counts[prefecture]).toBe(0);
    }
  });

  test("訪問済みの駅だけを都道府県別に集計する", () => {
    const stations = [
      buildStation({ id: "a", prefecture: "群馬県" }),
      buildStation({ id: "b", prefecture: "群馬県" }),
      buildStation({ id: "c", prefecture: "北海道" }),
    ];
    const counts = countVisitedByPrefecture(stations, new Set(["a", "c"]));

    expect(counts["群馬県"]).toBe(1);
    expect(counts["北海道"]).toBe(1);
    expect(counts["東京都"]).toBe(0);
  });
});

describe("getOverallVisitStats", () => {
  test("駅が 0 件の場合は達成率を 0 とする", () => {
    expect(getOverallVisitStats([], new Set())).toEqual({
      totalCount: 0,
      visitedCount: 0,
      achievementRate: 0,
    });
  });

  test("総数・訪問済み数・達成率を計算する", () => {
    const stations = [
      buildStation({ id: "a", prefecture: "群馬県" }),
      buildStation({ id: "b", prefecture: "北海道" }),
      buildStation({ id: "c", prefecture: "東京都" }),
    ];

    expect(getOverallVisitStats(stations, new Set(["a"]))).toEqual({
      totalCount: 3,
      visitedCount: 1,
      achievementRate: 33.3,
    });
  });

  test("未訪問の駅 ID が含まれていても無視する", () => {
    const stations = [buildStation({ id: "a", prefecture: "群馬県" })];

    expect(
      getOverallVisitStats(stations, new Set(["a", "not-existing"])),
    ).toEqual({
      totalCount: 1,
      visitedCount: 1,
      achievementRate: 100,
    });
  });
});

import { countByPrefecture } from "../../src/lib/countByPrefecture";
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
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("すべての都道府県のキーを 0 件で初期化する", () => {
  const counts = countByPrefecture([]);
  for (const prefecture of PREFECTURES) {
    expect(counts[prefecture]).toBe(0);
  }
});

test("都道府県ごとの件数を集計する", () => {
  const counts = countByPrefecture([
    buildStation({ prefecture: "群馬県" }),
    buildStation({ prefecture: "群馬県" }),
    buildStation({ prefecture: "北海道" }),
  ]);

  expect(counts["群馬県"]).toBe(2);
  expect(counts["北海道"]).toBe(1);
  expect(counts["東京都"]).toBe(0);
});

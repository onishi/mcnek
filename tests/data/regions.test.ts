import { getRegion } from "../../src/data/regions";
import { PREFECTURES, REGIONS } from "../../src/types/roadsideStation";

test("都道府県すべてに地方が対応している", () => {
  for (const prefecture of PREFECTURES) {
    expect(REGIONS).toContain(getRegion(prefecture));
  }
});

test.each([
  ["北海道", "北海道地方"],
  ["岩手県", "東北地方"],
  ["東京都", "関東地方"],
  ["愛知県", "中部地方"],
  ["大阪府", "近畿地方"],
  ["広島県", "中国地方"],
  ["香川県", "四国地方"],
  ["沖縄県", "九州・沖縄地方"],
] as const)("%s は %s に属する", (prefecture, region) => {
  expect(getRegion(prefecture)).toBe(region);
});

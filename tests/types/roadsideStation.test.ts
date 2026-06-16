import { PREFECTURES, REGIONS } from "../../src/types/roadsideStation";

test("都道府県は47件、重複なく定義されている", () => {
  expect(PREFECTURES).toHaveLength(47);
  expect(new Set(PREFECTURES).size).toBe(47);
});

test("地方は8件、重複なく定義されている", () => {
  expect(REGIONS).toHaveLength(8);
  expect(new Set(REGIONS).size).toBe(8);
});

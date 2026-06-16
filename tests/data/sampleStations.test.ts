import { sampleStations } from "../../src/data/sampleStations";
import { PREFECTURES } from "../../src/types/roadsideStation";

test("サンプル道の駅データは3件である", () => {
  expect(sampleStations).toHaveLength(3);
});

test("id は重複しない", () => {
  const ids = sampleStations.map((station) => station.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("prefecture は定義済みの都道府県のいずれかである", () => {
  for (const station of sampleStations) {
    expect(PREFECTURES).toContain(station.prefecture);
  }
});

test("name と address が空でない", () => {
  for (const station of sampleStations) {
    expect(station.name.length).toBeGreaterThan(0);
    expect(station.address.length).toBeGreaterThan(0);
  }
});

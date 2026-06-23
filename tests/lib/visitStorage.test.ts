import {
  filterByVisited,
  getVisitedStationIds,
  isStationVisited,
  setStationVisited,
} from "../../src/lib/visitStorage";
import type { RoadsideStation } from "../../src/types/roadsideStation";

function buildStation(
  overrides: Partial<RoadsideStation> = {},
): RoadsideStation {
  return {
    id: "test-id",
    name: "テスト駅",
    prefecture: "東京都",
    municipality: "千代田区",
    address: "東京都千代田区",
    registrationRound: 1,
    registrationDate: "2020-04",
    latitude: null,
    longitude: null,
    mlitSourceUrl: "https://www.mlit.go.jp/road/Michi-no-Eki/list.html",
    associationSourceUrls: [],
    updatedAt: "2026-06-20T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

test("初期状態ではどの駅も訪問済みではない", () => {
  expect(isStationVisited("station-1")).toBe(false);
  expect(getVisitedStationIds()).toEqual([]);
});

test("setStationVisited(id, true) で訪問済みとして保存される", () => {
  setStationVisited("station-1", true);
  expect(isStationVisited("station-1")).toBe(true);
  expect(getVisitedStationIds()).toEqual(["station-1"]);
});

test("setStationVisited(id, false) で訪問済み状態を取り消せる", () => {
  setStationVisited("station-1", true);
  setStationVisited("station-1", false);
  expect(isStationVisited("station-1")).toBe(false);
  expect(getVisitedStationIds()).toEqual([]);
});

test("同じ駅を複数回訪問済みにしても重複登録されない", () => {
  setStationVisited("station-1", true);
  setStationVisited("station-1", true);
  expect(getVisitedStationIds()).toEqual(["station-1"]);
});

test("複数の駅の訪問状態を独立して管理できる", () => {
  setStationVisited("station-1", true);
  setStationVisited("station-2", true);
  setStationVisited("station-1", false);
  expect(getVisitedStationIds()).toEqual(["station-2"]);
});

test("localStorage の内容が壊れている場合は未訪問として扱う", () => {
  localStorage.setItem("mcnek:visitRecords", "not-json");
  expect(getVisitedStationIds()).toEqual([]);
  expect(isStationVisited("station-1")).toBe(false);
});

test("filterByVisited は visitedOnly が false ならそのまま返す", () => {
  const stations = [buildStation({ id: "a" }), buildStation({ id: "b" })];
  expect(filterByVisited(stations, new Set(["a"]), false)).toEqual(stations);
});

test("filterByVisited は visitedOnly が true なら訪問済みの駅だけ返す", () => {
  const visited = buildStation({ id: "a" });
  const notVisited = buildStation({ id: "b" });
  expect(filterByVisited([visited, notVisited], new Set(["a"]), true)).toEqual([
    visited,
  ]);
});

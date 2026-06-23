import {
  findStationsWithoutCoordinates,
  hasCoordinates,
  isValidCoordinate,
} from "../../src/lib/coordinates";
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

test.each([
  [35.6895, 139.6917, true],
  [90, 180, true],
  [-90, -180, true],
  [90.1, 0, false],
  [-90.1, 0, false],
  [0, 180.1, false],
  [0, -180.1, false],
  [NaN, 0, false],
  [0, NaN, false],
])("isValidCoordinate(%p, %p) -> %p", (latitude, longitude, expected) => {
  expect(isValidCoordinate(latitude, longitude)).toBe(expected);
});

test("緯度経度がともにある場合は hasCoordinates が true を返す", () => {
  expect(hasCoordinates({ latitude: 35.6895, longitude: 139.6917 })).toBe(true);
});

test("緯度経度がともに null の場合は hasCoordinates が false を返す", () => {
  expect(hasCoordinates({ latitude: null, longitude: null })).toBe(false);
});

test("緯度経度が片方だけ null の場合は hasCoordinates が false を返す", () => {
  expect(hasCoordinates({ latitude: 35.6895, longitude: null })).toBe(false);
  expect(hasCoordinates({ latitude: null, longitude: 139.6917 })).toBe(false);
});

test("findStationsWithoutCoordinates は緯度経度が未登録の駅だけを返す", () => {
  const withCoordinates = buildStation({
    id: "with",
    latitude: 35.6895,
    longitude: 139.6917,
  });
  const withoutCoordinates = buildStation({ id: "without" });

  expect(
    findStationsWithoutCoordinates([withCoordinates, withoutCoordinates]),
  ).toEqual([withoutCoordinates]);
});

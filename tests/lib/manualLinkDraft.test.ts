import {
  exportManualLinkDrafts,
  getAllManualLinkDrafts,
  setManualLinkDraft,
} from "../../src/lib/manualLinkDraft";

beforeEach(() => {
  localStorage.clear();
});

test("初期状態では draft は空", () => {
  expect(getAllManualLinkDrafts()).toEqual({});
});

test("駅IDに対する連絡会パスを保存できる", () => {
  setManualLinkDraft("station-1", ["/stations/views/1", "/stations/views/2"]);

  expect(getAllManualLinkDrafts()).toEqual({
    "station-1": ["/stations/views/1", "/stations/views/2"],
  });
});

test("空配列を設定すると draft から削除される", () => {
  setManualLinkDraft("station-1", ["/stations/views/1"]);
  setManualLinkDraft("station-1", []);

  expect(getAllManualLinkDrafts()).toEqual({});
});

test("複数の駅の draft を ManualMichiNoEkiLink の配列として出力する", () => {
  setManualLinkDraft("station-1", ["/stations/views/1"]);
  setManualLinkDraft("station-2", ["/stations/views/2", "/stations/views/3"]);

  expect(exportManualLinkDrafts()).toEqual(
    expect.arrayContaining([
      { mlitStationId: "station-1", stationPaths: ["/stations/views/1"] },
      {
        mlitStationId: "station-2",
        stationPaths: ["/stations/views/2", "/stations/views/3"],
      },
    ]),
  );
});

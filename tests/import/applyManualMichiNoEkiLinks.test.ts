import { applyManualMichiNoEkiLinks } from "../../src/import/applyManualMichiNoEkiLinks";
import { buildMichiNoEkiUrl } from "../../src/lib/michiNoEkiUrl";
import type { ManualMichiNoEkiLink } from "../../src/lib/manualMichiNoEkiLinks";
import type { RoadsideStation } from "../../src/types/roadsideStation";

const baseStation: RoadsideStation = {
  id: "abc123",
  name: "安達",
  prefecture: "福島県",
  municipality: "二本松市",
  address: "福島県二本松市",
  registrationRound: 1,
  registrationDate: "1993-04",
  latitude: null,
  longitude: null,
  mlitSourceUrl: "https://example.com",
  associationSourceUrls: [],
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("手動紐付けで複数の連絡会URLを1つの駅に追加できる", () => {
  const manualLinks: ManualMichiNoEkiLink[] = [
    {
      mlitStationId: baseStation.id,
      stationPaths: ["/stations/views/1", "/stations/views/2"],
    },
  ];

  const [result] = applyManualMichiNoEkiLinks([baseStation], manualLinks);

  expect(result.associationSourceUrls).toEqual([
    buildMichiNoEkiUrl("/stations/views/1"),
    buildMichiNoEkiUrl("/stations/views/2"),
  ]);
});

test("自動マッチング済みのURLと手動紐付けのURLを両方保持する", () => {
  const station = {
    ...baseStation,
    associationSourceUrls: [buildMichiNoEkiUrl("/stations/views/1")],
  };
  const manualLinks: ManualMichiNoEkiLink[] = [
    { mlitStationId: station.id, stationPaths: ["/stations/views/2"] },
  ];

  const [result] = applyManualMichiNoEkiLinks([station], manualLinks);

  expect(result.associationSourceUrls).toEqual([
    buildMichiNoEkiUrl("/stations/views/1"),
    buildMichiNoEkiUrl("/stations/views/2"),
  ]);
});

test("同じURLが重複しても1件にまとめる", () => {
  const station = {
    ...baseStation,
    associationSourceUrls: [buildMichiNoEkiUrl("/stations/views/1")],
  };
  const manualLinks: ManualMichiNoEkiLink[] = [
    { mlitStationId: station.id, stationPaths: ["/stations/views/1"] },
  ];

  const [result] = applyManualMichiNoEkiLinks([station], manualLinks);

  expect(result.associationSourceUrls).toEqual([
    buildMichiNoEkiUrl("/stations/views/1"),
  ]);
});

test("該当する手動紐付けがない駅はそのまま返す", () => {
  const [result] = applyManualMichiNoEkiLinks([baseStation], []);
  expect(result).toEqual(baseStation);
});

test("対象の駅IDがない手動紐付けは無視する", () => {
  const manualLinks: ManualMichiNoEkiLink[] = [
    { mlitStationId: "別の駅ID", stationPaths: ["/stations/views/1"] },
  ];

  const [result] = applyManualMichiNoEkiLinks([baseStation], manualLinks);
  expect(result.associationSourceUrls).toEqual([]);
});

import { validateManualMichiNoEkiLinks } from "../../src/import/validateManualMichiNoEkiLinks";
import type { ManualMichiNoEkiLink } from "../../src/lib/manualMichiNoEkiLinks";
import type { RoadsideStation } from "../../src/types/roadsideStation";
import type { MichiNoEkiRecord } from "../../src/import/parseMichiNoEkiPage";

const station: RoadsideStation = {
  id: "station-1",
  name: "テスト駅",
  prefecture: "群馬県",
  municipality: "前橋市",
  address: "群馬県前橋市",
  registrationRound: 1,
  registrationDate: "1993-04",
  latitude: null,
  longitude: null,
  mlitSourceUrl: "https://example.com",
  associationSourceUrls: [],
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const record: MichiNoEkiRecord = {
  name: "テスト駅",
  prefecture: "群馬県",
  municipality: "前橋市",
  stationPath: "/stations/views/1",
};

test("駅IDとパスがどちらも存在する場合は問題なしとする", () => {
  const links: ManualMichiNoEkiLink[] = [
    { mlitStationId: "station-1", stationPaths: ["/stations/views/1"] },
  ];

  expect(validateManualMichiNoEkiLinks(links, [station], [record])).toEqual({
    unknownStationIds: [],
    unknownStationPaths: [],
  });
});

test("存在しない駅IDを検出する", () => {
  const links: ManualMichiNoEkiLink[] = [
    { mlitStationId: "not-exist", stationPaths: ["/stations/views/1"] },
  ];

  const result = validateManualMichiNoEkiLinks(links, [station], [record]);
  expect(result.unknownStationIds).toEqual(["not-exist"]);
  expect(result.unknownStationPaths).toEqual([]);
});

test("存在しない連絡会パスを検出する", () => {
  const links: ManualMichiNoEkiLink[] = [
    { mlitStationId: "station-1", stationPaths: ["/stations/views/999"] },
  ];

  const result = validateManualMichiNoEkiLinks(links, [station], [record]);
  expect(result.unknownStationIds).toEqual([]);
  expect(result.unknownStationPaths).toEqual(["/stations/views/999"]);
});

test("1件のリンクに複数のパスがある場合、存在しないものだけを検出する", () => {
  const links: ManualMichiNoEkiLink[] = [
    {
      mlitStationId: "station-1",
      stationPaths: ["/stations/views/1", "/stations/views/999"],
    },
  ];

  const result = validateManualMichiNoEkiLinks(links, [station], [record]);
  expect(result.unknownStationPaths).toEqual(["/stations/views/999"]);
});

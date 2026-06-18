import * as XLSX from "xlsx";
import { parseMlitStationsWorkbook } from "../../src/import/parseMlitStations";

const HEADER = [
  "県名",
  "駅 名",
  "登録回",
  "登録年月",
  "所在地",
  "ホームページアドレス",
];

function buildWorkbookBuffer(rows: (string | null)[][]): Buffer {
  const sheet = XLSX.utils.aoa_to_sheet([HEADER, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "List");
  return XLSX.write(workbook, { type: "buffer", bookType: "biff8" }) as Buffer;
}

test("駅名・登録回・登録年月・所在地を読み取る", () => {
  const buffer = buildWorkbookBuffer([
    [
      "群馬県",
      "川場田園プラザ",
      "第1回",
      "H5.4",
      "利根郡川場村",
      "https://example.com",
    ],
  ]);

  expect(parseMlitStationsWorkbook(buffer)).toEqual([
    {
      prefecture: "群馬県",
      name: "川場田園プラザ",
      registrationRound: "第1回",
      registrationDate: "H5.4",
      municipality: "利根郡川場村",
    },
  ]);
});

test("複数行を読み取り件数が一致する", () => {
  const buffer = buildWorkbookBuffer([
    [
      "北海道",
      "とようら",
      "第1回",
      "H5.4",
      "虻田郡豊浦町",
      "https://example.com",
    ],
    ["岩手県", "遠野風の丘", "第2回", "H10.8", "遠野市", "https://example.com"],
    ["東京都", "テスト駅", "第3回", "R3.6", "千代田区", "https://example.com"],
  ]);

  expect(parseMlitStationsWorkbook(buffer)).toHaveLength(3);
});

test("全角のＨを半角のHに正規化する", () => {
  const buffer = buildWorkbookBuffer([
    ["群馬県", "テスト駅", "第1回", "Ｈ5.4", "前橋市", "https://example.com"],
  ]);

  expect(parseMlitStationsWorkbook(buffer)[0].registrationDate).toBe("H5.4");
});

test("登録年月が空の場合は null になる", () => {
  const buffer = buildWorkbookBuffer([
    ["群馬県", "テスト駅", "第1回", "", "前橋市", "https://example.com"],
  ]);

  expect(parseMlitStationsWorkbook(buffer)[0].registrationDate).toBeNull();
});

test("県名が空の行はスキップする", () => {
  const buffer = buildWorkbookBuffer([
    ["群馬県", "テスト駅", "第1回", "H5.4", "前橋市", "https://example.com"],
    [null, null, null, null, null, null],
  ]);

  expect(parseMlitStationsWorkbook(buffer)).toHaveLength(1);
});

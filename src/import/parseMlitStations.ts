import * as XLSX from "xlsx";

/**
 * 国土交通省XLSから読み取った生データ。
 * 登録回・登録年月はこの段階では文字列のまま保持し、数値・YYYY-MM形式への変換は行わない（フェーズ6で実施）。
 */
export type MlitStationRecord = {
  prefecture: string;
  name: string;
  registrationRound: string;
  registrationDate: string | null;
  municipality: string;
};

const COLUMN_HEADERS = {
  prefecture: "県名",
  name: "駅 名",
  registrationRound: "登録回",
  registrationDate: "登録年月",
  municipality: "所在地",
} as const;

function trimString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeEraPrefix(value: string): string {
  return value.replace(/^Ｈ/, "H").replace(/^Ｒ/, "R").replace(/^Ｓ/, "S");
}

export function parseMlitStationsWorkbook(buffer: Buffer): MlitStationRecord[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
    blankrows: false,
  });

  const records: MlitStationRecord[] = [];
  for (const row of rows) {
    const prefecture = trimString(row[COLUMN_HEADERS.prefecture]);
    if (!prefecture) {
      continue;
    }

    const registrationDateRaw = trimString(
      row[COLUMN_HEADERS.registrationDate],
    );

    records.push({
      prefecture,
      name: trimString(row[COLUMN_HEADERS.name]) ?? "",
      registrationRound:
        trimString(row[COLUMN_HEADERS.registrationRound]) ?? "",
      registrationDate: registrationDateRaw
        ? normalizeEraPrefix(registrationDateRaw)
        : null,
      municipality: trimString(row[COLUMN_HEADERS.municipality]) ?? "",
    });
  }

  return records;
}

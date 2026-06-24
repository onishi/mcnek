import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { RoadsideStation } from "../../src/types/roadsideStation";
import type { MichiNoEkiRecord } from "../../src/import/parseMichiNoEkiPage";
import { DataMatchPage } from "../../src/pages/DataMatchPage";
import { getAllManualLinkDrafts } from "../../src/lib/manualLinkDraft";

function buildStation(overrides: Partial<RoadsideStation> = {}): RoadsideStation {
  return {
    id: "matched-1",
    name: "一致駅",
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
    ...overrides,
  };
}

const matchedStation = buildStation({
  id: "matched-1",
  name: "一致駅",
  associationSourceUrls: ["https://www.michi-no-eki.jp/stations/views/1"],
});
const unmatchedStation = buildStation({
  id: "unmatched-1",
  name: "未一致駅",
  municipality: "高崎市",
  associationSourceUrls: [],
});

const mockStations: RoadsideStation[] = [matchedStation, unmatchedStation];

const mockEkiRecords: MichiNoEkiRecord[] = [
  {
    name: "一致駅",
    prefecture: "群馬県",
    municipality: "前橋市",
    stationPath: "/stations/views/1",
  },
  {
    name: "未一致連絡会駅",
    prefecture: "群馬県",
    municipality: "桐生市",
    stationPath: "/stations/views/2",
  },
];

jest.mock("../../src/data/stations", () => ({
  get roadsideStations(): RoadsideStation[] {
    return mockStations;
  },
}));

jest.mock("../../src/data/michiNoEkiStations", () => ({
  get michiNoEkiStations(): MichiNoEkiRecord[] {
    return mockEkiRecords;
  },
}));

beforeEach(() => {
  localStorage.clear();
});

function renderDataMatchPage() {
  return render(
    <MemoryRouter>
      <DataMatchPage />
    </MemoryRouter>,
  );
}

function findRowByHref(href: string): HTMLElement {
  const link = screen
    .getAllByRole("link")
    .find((candidate) => candidate.getAttribute("href") === href);
  if (!link) throw new Error(`リンクが見つかりません: ${href}`);
  const row = link.closest("tr");
  if (!row) throw new Error("行が見つかりません");
  return row;
}

test("見出しが表示される", () => {
  renderDataMatchPage();
  expect(
    screen.getByRole("heading", { name: "データ照合" }),
  ).toBeInTheDocument();
});

test("データ取得状況のレポートが表示される", () => {
  renderDataMatchPage();
  expect(
    screen.getByRole("heading", { name: "データ取得状況" }),
  ).toBeInTheDocument();
});

test("都道府県ごとの見出しに一致件数が表示される", () => {
  renderDataMatchPage();
  // 群馬県: 一致1件(matched-1) + 未一致mlit1件(unmatched-1) + 未一致eki1件(未一致連絡会駅) = 3行中1件一致
  expect(
    screen.getByRole("heading", { name: "群馬県 (1/3 一致)" }),
  ).toBeInTheDocument();
});

test("紐付けできた駅は国土交通省・連絡会の両方のリンクが同じ行に表示される", () => {
  renderDataMatchPage();
  const row = findRowByHref("/stations/matched-1");
  expect(row).toHaveTextContent("一致駅");
  expect(row).not.toHaveClass("data-match-overflow-row");
});

test("紐付けできなかった国土交通省データの駅は片側だけの行として表示される", () => {
  renderDataMatchPage();
  const row = findRowByHref("/stations/unmatched-1");
  expect(row).toHaveClass("data-match-overflow-row");
});

test("紐付けできなかった連絡会データは片側だけの行として表示される", () => {
  renderDataMatchPage();
  const row = findRowByHref(
    "https://www.michi-no-eki.jp/stations/views/2",
  );
  expect(row).toHaveClass("data-match-overflow-row");
});

test("未一致の国土交通省データ行には連絡会データを手動で選ぶチェックボックスが表示される", () => {
  renderDataMatchPage();
  const row = findRowByHref("/stations/unmatched-1");
  expect(row.querySelector("fieldset")).not.toBeNull();
  expect(row).toHaveTextContent("未一致連絡会駅");
});

test("チェックボックスを選ぶと手動紐付けの draft が localStorage に保存される", () => {
  renderDataMatchPage();
  const row = findRowByHref("/stations/unmatched-1");
  const checkbox = row.querySelector("input[type='checkbox']");
  if (!checkbox) throw new Error("チェックボックスが見つかりません");

  fireEvent.click(checkbox);

  expect(getAllManualLinkDrafts()["unmatched-1"]).toEqual([
    "/stations/views/2",
  ]);
});

test("手動紐付け後もチェックボックスが残り、外すと紐付けが解除される", () => {
  renderDataMatchPage();

  const checkbox = findRowByHref("/stations/unmatched-1").querySelector(
    "input[type='checkbox']",
  );
  if (!checkbox) throw new Error("チェックボックスが見つかりません");
  fireEvent.click(checkbox);

  expect(getAllManualLinkDrafts()["unmatched-1"]).toHaveLength(1);

  // 紐付け後も同じ駅の行にチェックボックスが残っていて、外せること
  const checkedBox = findRowByHref("/stations/unmatched-1").querySelector(
    "input[type='checkbox']:checked",
  );
  if (!checkedBox) {
    throw new Error("紐付け後にチェック済みのチェックボックスが見つかりません");
  }
  fireEvent.click(checkedBox);

  expect(getAllManualLinkDrafts()["unmatched-1"]).toBeUndefined();
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataMatchPage } from "../../src/pages/DataMatchPage";
import { roadsideStations } from "../../src/data/stations";
import { michiNoEkiStations } from "../../src/data/michiNoEkiStations";
import { groupStationsByPrefecture } from "../../src/lib/associationMatch";
import { getAllManualLinkDrafts } from "../../src/lib/manualLinkDraft";

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

test("見出しが表示される", () => {
  renderDataMatchPage();
  expect(
    screen.getByRole("heading", { name: "データ照合" }),
  ).toBeInTheDocument();
});

test("都道府県ごとの見出しに一致件数が表示される", () => {
  renderDataMatchPage();
  const groups = groupStationsByPrefecture(roadsideStations, michiNoEkiStations);
  const hokkaido = groups.find((group) => group.prefecture === "北海道");
  if (!hokkaido) throw new Error("北海道のグループが見つかりません");
  const matchedCount = hokkaido.rows.filter(
    (row) => row.mlitStation && row.michiNoEkiRecords.length > 0,
  ).length;

  expect(
    screen.getByRole("heading", {
      name: `北海道 (${matchedCount}/${hokkaido.rows.length} 一致)`,
    }),
  ).toBeInTheDocument();
});

test("紐付けできた駅は国土交通省・連絡会の両方のリンクが同じ行に表示される", () => {
  renderDataMatchPage();
  const groups = groupStationsByPrefecture(roadsideStations, michiNoEkiStations);
  const matchedRow = groups
    .flatMap((group) => group.rows)
    .find((row) => row.mlitStation && row.michiNoEkiRecords.length > 0);
  if (!matchedRow?.mlitStation || matchedRow.michiNoEkiRecords.length === 0) {
    throw new Error("一致した駅が見つかりません");
  }

  const mlitLink = screen
    .getAllByRole("link")
    .find(
      (link) =>
        link.getAttribute("href") === `/stations/${matchedRow.mlitStation?.id}`,
    );
  if (!mlitLink) throw new Error("国土交通省データへのリンクが見つかりません");
  const row = mlitLink.closest("tr");
  expect(row).not.toBeNull();
  expect(row).toHaveTextContent(matchedRow.michiNoEkiRecords[0].name);
});

test("紐付けできなかった駅は片側だけの行として表示される", () => {
  renderDataMatchPage();
  const groups = groupStationsByPrefecture(roadsideStations, michiNoEkiStations);
  const unmatchedRow = groups
    .flatMap((group) => group.rows)
    .find(
      (row) =>
        (!row.mlitStation && row.michiNoEkiRecords.length > 0) ||
        (row.mlitStation && row.michiNoEkiRecords.length === 0),
    );
  if (!unmatchedRow) throw new Error("未一致の行が見つかりません");

  if (unmatchedRow.mlitStation) {
    const link = screen
      .getAllByRole("link")
      .find(
        (candidate) =>
          candidate.getAttribute("href") ===
          `/stations/${unmatchedRow.mlitStation?.id}`,
      );
    if (!link) throw new Error("未一致行へのリンクが見つかりません");
    const row = link.closest("tr");
    expect(row).toHaveClass("data-match-overflow-row");
  } else {
    const ekiRecord = unmatchedRow.michiNoEkiRecords[0];
    const link = screen
      .getAllByRole("link")
      .find(
        (candidate) =>
          candidate.getAttribute("href") ===
          `https://www.michi-no-eki.jp${ekiRecord.stationPath}`,
      );
    if (!link) throw new Error("未一致行へのリンクが見つかりません");
    const row = link.closest("tr");
    expect(row).toHaveClass("data-match-overflow-row");
  }
});

test("未一致の国土交通省データ行には連絡会データを手動で選ぶチェックボックスが表示される", () => {
  renderDataMatchPage();
  const groups = groupStationsByPrefecture(roadsideStations, michiNoEkiStations);
  const unmatchedMlitRow = groups
    .flatMap((group) => group.rows)
    .find((row) => row.mlitStation && row.michiNoEkiRecords.length === 0);
  if (!unmatchedMlitRow?.mlitStation) {
    throw new Error("未一致の国土交通省データ行が見つかりません");
  }

  const link = screen
    .getAllByRole("link")
    .find(
      (candidate) =>
        candidate.getAttribute("href") ===
        `/stations/${unmatchedMlitRow.mlitStation?.id}`,
    );
  if (!link) throw new Error("国土交通省データへのリンクが見つかりません");
  const row = link.closest("tr");
  expect(row?.querySelector("fieldset")).not.toBeNull();
});

test("チェックボックスを選ぶと手動紐付けの draft が localStorage に保存される", () => {
  renderDataMatchPage();
  const groups = groupStationsByPrefecture(roadsideStations, michiNoEkiStations);
  const unmatchedMlitRow = groups
    .flatMap((group) => group.rows)
    .find((row) => row.mlitStation && row.michiNoEkiRecords.length === 0);
  if (!unmatchedMlitRow?.mlitStation) {
    throw new Error("未一致の国土交通省データ行が見つかりません");
  }

  const mlitLink = screen
    .getAllByRole("link")
    .find(
      (candidate) =>
        candidate.getAttribute("href") ===
        `/stations/${unmatchedMlitRow.mlitStation?.id}`,
    );
  if (!mlitLink) throw new Error("国土交通省データへのリンクが見つかりません");
  const row = mlitLink.closest("tr");
  const checkbox = row?.querySelector("input[type='checkbox']");
  if (!checkbox) throw new Error("チェックボックスが見つかりません");

  fireEvent.click(checkbox);

  const drafts = getAllManualLinkDrafts();
  expect(drafts[unmatchedMlitRow.mlitStation.id]).toHaveLength(1);
});

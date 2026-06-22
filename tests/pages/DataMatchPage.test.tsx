import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataMatchPage } from "../../src/pages/DataMatchPage";
import { roadsideStations } from "../../src/data/stations";
import { michiNoEkiStations } from "../../src/data/michiNoEkiStations";
import { findUnmatchedStations } from "../../src/lib/associationMatch";

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

test("未一致件数の見出しが実データと一致する", () => {
  renderDataMatchPage();
  const unmatchedCount = findUnmatchedStations(roadsideStations).length;
  expect(
    screen.getByRole("heading", { name: `未一致の駅 (${unmatchedCount} 件)` }),
  ).toBeInTheDocument();
});

test("都道府県別の一致率テーブルに全都道府県分の行がある", () => {
  renderDataMatchPage();
  expect(screen.getAllByText("北海道").length).toBeGreaterThan(0);
  expect(screen.getAllByText("沖縄県").length).toBeGreaterThan(0);
});

test("国土交通省データの一覧見出しが実データ件数と一致する", () => {
  renderDataMatchPage();
  expect(
    screen.getByRole("heading", {
      name: `国土交通省データの一覧 (${roadsideStations.length} 件)`,
    }),
  ).toBeInTheDocument();
});

test("連絡会データの一覧見出しが実データ件数と一致する", () => {
  renderDataMatchPage();
  expect(
    screen.getByRole("heading", {
      name: `全国「道の駅」連絡会データの一覧 (${michiNoEkiStations.length} 件)`,
    }),
  ).toBeInTheDocument();
});

test("連絡会データの一覧から michi-no-eki.jp の詳細ページへリンクする", () => {
  renderDataMatchPage();
  const firstRecord = michiNoEkiStations[0];
  const expectedHref = `https://www.michi-no-eki.jp${firstRecord.stationPath}`;
  const links = screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("href") === expectedHref);
  expect(links).toHaveLength(1);
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DataMatchPage } from "../../src/pages/DataMatchPage";
import { roadsideStations } from "../../src/data/stations";
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
  expect(screen.getByText("北海道")).toBeInTheDocument();
  expect(screen.getByText("沖縄県")).toBeInTheDocument();
});

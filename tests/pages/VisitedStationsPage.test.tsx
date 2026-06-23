import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { VisitedStationsPage } from "../../src/pages/VisitedStationsPage";
import { roadsideStations } from "../../src/data/stations";
import { setStationVisited } from "../../src/lib/visitStorage";

beforeEach(() => {
  localStorage.clear();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <VisitedStationsPage />
    </MemoryRouter>,
  );
}

test("訪問済みの駅だけを一覧表示する", () => {
  const visitedStation = roadsideStations[0];
  setStationVisited(visitedStation.id, true);

  renderPage();

  expect(screen.getByText("1 件")).toBeInTheDocument();
  expect(screen.getByText(visitedStation.name)).toBeInTheDocument();
});

test("訪問済みの駅がない場合は 0 件と表示する", () => {
  renderPage();

  expect(screen.getByText("0 件")).toBeInTheDocument();
});

test("全体の訪問数と達成率を表示する", () => {
  const visitedStation = roadsideStations[0];
  setStationVisited(visitedStation.id, true);

  renderPage();

  expect(
    screen.getByText(`訪問済み 1 / ${roadsideStations.length} 件（達成率`, {
      exact: false,
    }),
  ).toBeInTheDocument();
});

test("都道府県別の訪問数を表示する", () => {
  const visitedStation = roadsideStations[0];
  setStationVisited(visitedStation.id, true);

  renderPage();

  expect(screen.getAllByText(visitedStation.prefecture).length).toBeGreaterThan(
    0,
  );
});

test("一覧に戻るリンクがある", () => {
  renderPage();

  expect(screen.getByRole("link", { name: "一覧に戻る" })).toHaveAttribute(
    "href",
    "/",
  );
});

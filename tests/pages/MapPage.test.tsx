import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MapPage } from "../../src/pages/MapPage";
import { roadsideStations } from "../../src/data/stations";
import { setStationVisited } from "../../src/lib/visitStorage";

beforeEach(() => {
  localStorage.clear();
});

function renderMapPage() {
  return render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>,
  );
}

test("地図コンテナが表示される", () => {
  renderMapPage();
  expect(screen.getByTestId("map-container")).toBeInTheDocument();
});

test("表示件数を表示する", () => {
  renderMapPage();
  const stationsWithCoords = roadsideStations.filter(
    (s) => s.latitude !== null && s.longitude !== null,
  );
  expect(
    screen.getByText(`${stationsWithCoords.length} 件の道の駅を表示中`),
  ).toBeInTheDocument();
});

test("一覧に戻るリンクがある", () => {
  renderMapPage();
  expect(screen.getByRole("link", { name: "一覧に戻る" })).toHaveAttribute(
    "href",
    "/",
  );
});

test("訪問済みの駅のマーカーは visited アイコンを使う", () => {
  const station = roadsideStations[0];
  setStationVisited(station.id, true);

  renderMapPage();

  const visitedMarkers = document.querySelectorAll(
    '[data-icon-class="map-marker-visited"]',
  );
  expect(visitedMarkers.length).toBe(1);
});

test("未訪問の駅のマーカーは visited アイコンを使わない", () => {
  renderMapPage();

  const visitedMarkers = document.querySelectorAll(
    '[data-icon-class="map-marker-visited"]',
  );
  expect(visitedMarkers.length).toBe(0);
});

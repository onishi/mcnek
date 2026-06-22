import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StationList } from "../../src/components/StationList";
import { sampleStations } from "../../src/data/sampleStations";
import type { RoadsideStation } from "../../src/types/roadsideStation";

const mockStation: RoadsideStation = {
  id: "test-station",
  name: "テスト道の駅",
  prefecture: "東京都",
  municipality: "千代田区",
  address: "東京都千代田区1-1-1",
  registrationRound: 1,
  registrationDate: "2000-01",
  latitude: 35.6895,
  longitude: 139.6917,
  mlitSourceUrl: "https://example.com",
  associationSourceUrl: null,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderStationList(stations: RoadsideStation[]) {
  return render(
    <MemoryRouter>
      <StationList stations={stations} />
    </MemoryRouter>,
  );
}

test("件数を表示する", () => {
  renderStationList(sampleStations);
  expect(screen.getByText(`${sampleStations.length} 件`)).toBeInTheDocument();
});

test("各駅の名前を表示する", () => {
  renderStationList(sampleStations);
  for (const station of sampleStations) {
    expect(screen.getByText(station.name)).toBeInTheDocument();
  }
});

test("各駅の都道府県を表示する", () => {
  renderStationList(sampleStations);
  for (const station of sampleStations) {
    expect(screen.getAllByText(station.prefecture).length).toBeGreaterThan(0);
  }
});

test("各駅の住所を表示する", () => {
  renderStationList(sampleStations);
  for (const station of sampleStations) {
    expect(screen.getByText(station.address)).toBeInTheDocument();
  }
});

test("各駅が詳細ページへのリンクになっている", () => {
  renderStationList(sampleStations);
  for (const station of sampleStations) {
    expect(screen.getByText(station.name).closest("a")).toHaveAttribute(
      "href",
      `/stations/${station.id}`,
    );
  }
});

test("空の配列では 0 件を表示する", () => {
  renderStationList([]);
  expect(screen.getByText("0 件")).toBeInTheDocument();
});

test("空の配列では 0 件メッセージを表示する", () => {
  renderStationList([]);
  expect(
    screen.getByText("該当する道の駅が見つかりません"),
  ).toBeInTheDocument();
});

test("1 件のみのデータでも正しく表示する", () => {
  renderStationList([mockStation]);
  expect(screen.getByText("1 件")).toBeInTheDocument();
  expect(screen.getByText("テスト道の駅")).toBeInTheDocument();
  expect(screen.getByText("東京都千代田区1-1-1")).toBeInTheDocument();
});

test("訪問済みの駅には「行った済み」のバッジを表示する", () => {
  render(
    <MemoryRouter>
      <StationList
        stations={[mockStation]}
        visitedStationIds={new Set([mockStation.id])}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("行った済み")).toBeInTheDocument();
});

test("未訪問の駅にはバッジを表示しない", () => {
  renderStationList([mockStation]);
  expect(screen.queryByText("行った済み")).not.toBeInTheDocument();
});

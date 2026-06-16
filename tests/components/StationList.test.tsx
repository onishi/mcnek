import { render, screen } from "@testing-library/react";
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

test("件数を表示する", () => {
  render(<StationList stations={sampleStations} />);
  expect(screen.getByText(`${sampleStations.length} 件`)).toBeInTheDocument();
});

test("各駅の名前を表示する", () => {
  render(<StationList stations={sampleStations} />);
  for (const station of sampleStations) {
    expect(screen.getByText(station.name)).toBeInTheDocument();
  }
});

test("各駅の都道府県を表示する", () => {
  render(<StationList stations={sampleStations} />);
  for (const station of sampleStations) {
    expect(screen.getAllByText(station.prefecture).length).toBeGreaterThan(0);
  }
});

test("各駅の住所を表示する", () => {
  render(<StationList stations={sampleStations} />);
  for (const station of sampleStations) {
    expect(screen.getByText(station.address)).toBeInTheDocument();
  }
});

test("空の配列では 0 件を表示する", () => {
  render(<StationList stations={[]} />);
  expect(screen.getByText("0 件")).toBeInTheDocument();
});

test("1 件のみのデータでも正しく表示する", () => {
  render(<StationList stations={[mockStation]} />);
  expect(screen.getByText("1 件")).toBeInTheDocument();
  expect(screen.getByText("テスト道の駅")).toBeInTheDocument();
  expect(screen.getByText("東京都千代田区1-1-1")).toBeInTheDocument();
});

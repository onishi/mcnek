import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StationDetailPage } from "../../src/pages/StationDetailPage";
import { sampleStations } from "../../src/data/sampleStations";

function renderDetailPage(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/stations/${id}`]}>
      <Routes>
        <Route path="/stations/:id" element={<StationDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

test("駅名を見出しに表示する", () => {
  const station = sampleStations[0];
  renderDetailPage(station.id);
  expect(
    screen.getByRole("heading", { name: station.name }),
  ).toBeInTheDocument();
});

test("所在地を表示する", () => {
  const station = sampleStations[0];
  renderDetailPage(station.id);
  expect(screen.getByText(station.address)).toBeInTheDocument();
});

test("登録年月を表示する", () => {
  const station = sampleStations[0];
  renderDetailPage(station.id);
  expect(screen.getByText(station.registrationDate!)).toBeInTheDocument();
});

test("一覧に戻るリンクがある", () => {
  const station = sampleStations[0];
  renderDetailPage(station.id);
  expect(screen.getByRole("link", { name: "一覧に戻る" })).toHaveAttribute(
    "href",
    "/",
  );
});

test("存在しない駅 ID の場合は見つからない旨を表示する", () => {
  renderDetailPage("not-existing-id");
  expect(
    screen.getByText("指定された道の駅が見つかりません"),
  ).toBeInTheDocument();
});

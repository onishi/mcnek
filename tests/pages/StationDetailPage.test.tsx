import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StationDetailPage } from "../../src/pages/StationDetailPage";
import { roadsideStations } from "../../src/data/stations";

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
  const station = roadsideStations[0];
  renderDetailPage(station.id);
  expect(
    screen.getByRole("heading", { name: station.name }),
  ).toBeInTheDocument();
});

test("所在地を表示する", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);
  expect(screen.getByText(station.address)).toBeInTheDocument();
});

test("登録年月を表示する", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);
  expect(screen.getByText(station.registrationDate!)).toBeInTheDocument();
});

test("国土交通省の参照リンクを表示する", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);
  expect(
    screen.getByRole("link", { name: "国土交通省の一覧を見る" }),
  ).toHaveAttribute("href", station.mlitSourceUrl);
});

test("連絡会の詳細URLが未登録の場合はその旨を表示する", () => {
  const station = roadsideStations.find(
    (s) => s.associationSourceUrl === null,
  )!;
  renderDetailPage(station.id);
  expect(
    screen.getByText("全国「道の駅」連絡会の詳細は未登録です"),
  ).toBeInTheDocument();
});

test("一覧に戻るリンクがある", () => {
  const station = roadsideStations[0];
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

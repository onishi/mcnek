import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { StationDetailPage } from "../../src/pages/StationDetailPage";
import { roadsideStations } from "../../src/data/stations";
import { isStationVisited } from "../../src/lib/visitStorage";

function renderDetailPage(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/stations/${id}`]}>
      <Routes>
        <Route path="/stations/:id" element={<StationDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

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

test("緯度経度が未登録の場合は位置情報に未登録と表示する", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);
  expect(screen.getByText("未登録")).toBeInTheDocument();
});

test("連絡会の詳細URLがある場合はリンクを表示する", () => {
  const station = roadsideStations.find(
    (s) => s.associationSourceUrls.length > 0,
  )!;
  renderDetailPage(station.id);
  expect(
    screen.getByRole("link", { name: /全国「道の駅」連絡会の詳細を見る/ }),
  ).toHaveAttribute("href", station.associationSourceUrls[0]);
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

test("「行った」ボタンを押すと訪問済みになり localStorage に保存される", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);

  const button = screen.getByRole("button", { name: "行った" });
  fireEvent.click(button);

  expect(
    screen.getByRole("button", { name: "行った済み" }),
  ).toBeInTheDocument();
  expect(isStationVisited(station.id)).toBe(true);
});

test("訪問済みの状態でもう一度押すと未訪問に戻る", () => {
  const station = roadsideStations[0];
  renderDetailPage(station.id);

  const button = screen.getByRole("button", { name: "行った" });
  fireEvent.click(button);
  fireEvent.click(screen.getByRole("button", { name: "行った済み" }));

  expect(screen.getByRole("button", { name: "行った" })).toBeInTheDocument();
  expect(isStationVisited(station.id)).toBe(false);
});

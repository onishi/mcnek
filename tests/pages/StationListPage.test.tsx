import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StationListPage } from "../../src/pages/StationListPage";
import { roadsideStations } from "../../src/data/stations";
import { setStationVisited } from "../../src/lib/visitStorage";

beforeEach(() => {
  localStorage.clear();
});

function renderListPage() {
  return render(
    <MemoryRouter>
      <StationListPage />
    </MemoryRouter>,
  );
}

test("「行った道の駅だけ表示」をチェックすると訪問済みの駅だけになる", () => {
  const visitedStation = roadsideStations[0];
  setStationVisited(visitedStation.id, true);

  renderListPage();

  fireEvent.click(
    screen.getByRole("checkbox", { name: "行った道の駅だけ表示" }),
  );

  expect(screen.getByText("1 件")).toBeInTheDocument();
  expect(screen.getByText(visitedStation.name)).toBeInTheDocument();
});

test("訪問済みの駅がない場合にチェックすると 0 件になる", () => {
  renderListPage();

  fireEvent.click(
    screen.getByRole("checkbox", { name: "行った道の駅だけ表示" }),
  );

  expect(screen.getByText("0 件")).toBeInTheDocument();
});

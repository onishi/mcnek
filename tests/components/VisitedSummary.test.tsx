import { render, screen } from "@testing-library/react";
import { VisitedSummary } from "../../src/components/VisitedSummary";

test("訪問済み件数・総数・達成率を表示する", () => {
  render(
    <VisitedSummary totalCount={10} visitedCount={3} achievementRate={30} />,
  );

  expect(
    screen.getByText("訪問済み 3 / 10 件（達成率 30%）"),
  ).toBeInTheDocument();
});

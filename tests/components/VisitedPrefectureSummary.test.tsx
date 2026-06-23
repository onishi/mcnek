import { render, screen } from "@testing-library/react";
import { VisitedPrefectureSummary } from "../../src/components/VisitedPrefectureSummary";
import { PREFECTURES } from "../../src/types/roadsideStation";

function buildCounts(overrides: Partial<Record<string, number>>) {
  return Object.fromEntries(
    PREFECTURES.map((prefecture) => [prefecture, overrides[prefecture] ?? 0]),
  ) as Record<(typeof PREFECTURES)[number], number>;
}

test("都道府県ごとに訪問済み件数 / 総数を表示する", () => {
  render(
    <VisitedPrefectureSummary
      counts={buildCounts({ 群馬県: 5, 北海道: 2 })}
      visitedCounts={buildCounts({ 群馬県: 2, 北海道: 0 })}
    />,
  );

  expect(screen.getByText("群馬県")).toBeInTheDocument();
  expect(screen.getByText("2 / 5")).toBeInTheDocument();
  expect(screen.getByText("0 / 2")).toBeInTheDocument();
});

test("すべての都道府県を表示する", () => {
  render(
    <VisitedPrefectureSummary
      counts={buildCounts({})}
      visitedCounts={buildCounts({})}
    />,
  );

  for (const prefecture of PREFECTURES) {
    expect(screen.getByText(prefecture)).toBeInTheDocument();
  }
});

import "./VisitedSummary.css";

type Props = {
  totalCount: number;
  visitedCount: number;
  achievementRate: number;
};

export function VisitedSummary({
  totalCount,
  visitedCount,
  achievementRate,
}: Props) {
  return (
    <p className="visited-summary">
      訪問済み {visitedCount} / {totalCount} 件（達成率 {achievementRate}%）
    </p>
  );
}

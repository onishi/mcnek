import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture } from "../types/roadsideStation";
import "./VisitedPrefectureSummary.css";

type Props = {
  counts: Record<Prefecture, number>;
  visitedCounts: Record<Prefecture, number>;
};

export function VisitedPrefectureSummary({ counts, visitedCounts }: Props) {
  return (
    <ul
      className="visited-prefecture-summary"
      tabIndex={0}
      aria-label="都道府県別の達成状況（スクロールできます）"
    >
      {PREFECTURES.map((prefecture) => (
        <li key={prefecture} className="visited-prefecture-summary-item">
          <span className="visited-prefecture-summary-name">{prefecture}</span>
          <span className="visited-prefecture-summary-count">
            {visitedCounts[prefecture]} / {counts[prefecture]}
          </span>
        </li>
      ))}
    </ul>
  );
}

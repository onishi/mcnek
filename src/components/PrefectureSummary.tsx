import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture } from "../types/roadsideStation";
import "./PrefectureSummary.css";

type Props = {
  counts: Record<Prefecture, number>;
};

export function PrefectureSummary({ counts }: Props) {
  return (
    <ul
      className="prefecture-summary"
      tabIndex={0}
      aria-label="都道府県別の件数（スクロールできます）"
    >
      {PREFECTURES.map((prefecture) => (
        <li key={prefecture} className="prefecture-summary-item">
          <span className="prefecture-summary-name">{prefecture}</span>
          <span className="prefecture-summary-count">{counts[prefecture]}</span>
        </li>
      ))}
    </ul>
  );
}

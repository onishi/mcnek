import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture } from "../types/roadsideStation";
import "./PrefectureSummary.css";

type Props = {
  counts: Record<Prefecture, number>;
  selected?: Prefecture | "";
  onSelect?: (prefecture: Prefecture | "") => void;
};

export function PrefectureSummary({ counts, selected, onSelect }: Props) {
  return (
    <ul
      className="prefecture-summary"
      tabIndex={0}
      aria-label="都道府県別の件数（スクロールできます）"
    >
      {PREFECTURES.map((prefecture) => (
        <li key={prefecture}>
          <button
            className={`prefecture-summary-item${selected === prefecture ? " prefecture-summary-item--active" : ""}`}
            onClick={() => onSelect?.(selected === prefecture ? "" : prefecture)}
            aria-pressed={selected === prefecture}
          >
            <span className="prefecture-summary-name">{prefecture}</span>
            <span className="prefecture-summary-count">{counts[prefecture]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

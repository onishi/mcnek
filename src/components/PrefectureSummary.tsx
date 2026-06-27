import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, Region } from "../types/roadsideStation";
import { getRegion } from "../data/regions";
import "./PrefectureSummary.css";

type Props = {
  counts: Record<Prefecture, number>;
  selected?: Prefecture | "";
  onSelect?: (prefecture: Prefecture | "") => void;
  filterRegion?: Region | "";
};

export function PrefectureSummary({ counts, selected, onSelect, filterRegion }: Props) {
  const visiblePrefectures = filterRegion
    ? PREFECTURES.filter((p) => getRegion(p) === filterRegion)
    : PREFECTURES;

  return (
    <ul
      className="prefecture-summary"
      tabIndex={0}
      aria-label="都道府県別の件数（スクロールできます）"
    >
      {visiblePrefectures.map((prefecture) => (
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

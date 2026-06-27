import { PREFECTURES } from "../types/roadsideStation";
import type { Prefecture, Region } from "../types/roadsideStation";
import { getRegion } from "../data/regions";
import "./PrefectureSummary.css";

type Props = {
  counts: Record<Prefecture, number>;
  selected: Prefecture[];
  onSelect: (prefecture: Prefecture) => void;
  filterRegions?: Region[];
};

export function PrefectureSummary({ counts, selected, onSelect, filterRegions }: Props) {
  const visiblePrefectures = filterRegions?.length
    ? PREFECTURES.filter((p) => filterRegions.includes(getRegion(p)))
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
            className={`prefecture-summary-item${selected.includes(prefecture) ? " prefecture-summary-item--active" : ""}`}
            onClick={() => onSelect(prefecture)}
            aria-pressed={selected.includes(prefecture)}
          >
            <span className="prefecture-summary-name">{prefecture}</span>
            <span className="prefecture-summary-count">{counts[prefecture]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

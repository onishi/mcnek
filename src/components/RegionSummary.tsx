import { REGIONS } from "../types/roadsideStation";
import type { Region } from "../types/roadsideStation";
import "./RegionSummary.css";

type Props = {
  counts: Record<Region, number>;
  selected: Region[];
  onSelect: (region: Region) => void;
};

export function RegionSummary({ counts, selected, onSelect }: Props) {
  return (
    <ul className="region-summary" aria-label="地方で絞り込み">
      {REGIONS.map((region) => (
        <li key={region}>
          <button
            className={`region-summary-item${selected.includes(region) ? " region-summary-item--active" : ""}`}
            onClick={() => onSelect(region)}
            aria-pressed={selected.includes(region)}
          >
            <span className="region-summary-name">{region}</span>
            <span className="region-summary-count">{counts[region]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

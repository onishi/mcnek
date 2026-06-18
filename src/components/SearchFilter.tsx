import { PREFECTURES, REGIONS } from "../types/roadsideStation";
import type { Prefecture, Region } from "../types/roadsideStation";
import "./SearchFilter.css";

type Props = {
  query: string;
  prefecture: Prefecture | "";
  region: Region | "";
  onQueryChange: (query: string) => void;
  onPrefectureChange: (prefecture: Prefecture | "") => void;
  onRegionChange: (region: Region | "") => void;
};

export function SearchFilter({
  query,
  prefecture,
  region,
  onQueryChange,
  onPrefectureChange,
  onRegionChange,
}: Props) {
  return (
    <div className="search-filter">
      <input
        type="search"
        className="search-filter-query"
        placeholder="駅名で検索"
        aria-label="駅名で検索"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        className="search-filter-select"
        aria-label="都道府県で絞り込み"
        value={prefecture}
        onChange={(event) =>
          onPrefectureChange(event.target.value as Prefecture | "")
        }
      >
        <option value="">都道府県（すべて）</option>
        {PREFECTURES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        className="search-filter-select"
        aria-label="地方で絞り込み"
        value={region}
        onChange={(event) => onRegionChange(event.target.value as Region | "")}
      >
        <option value="">地方（すべて）</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}

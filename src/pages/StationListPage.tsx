import { useMemo, useState } from "react";
import { roadsideStations } from "../data/stations";
import { StationList } from "../components/StationList";
import { SearchFilter } from "../components/SearchFilter";
import { PrefectureSummary } from "../components/PrefectureSummary";
import { Pagination } from "../components/Pagination";
import { filterStations } from "../lib/filterStations";
import { countByPrefecture } from "../lib/countByPrefecture";
import { getTotalPages, paginate } from "../lib/paginate";
import { filterByVisited, getVisitedStationIds } from "../lib/visitStorage";
import type { Prefecture, Region } from "../types/roadsideStation";
import "./StationListPage.css";

const PAGE_SIZE = 30;

export function StationListPage() {
  const [query, setQuery] = useState("");
  const [prefecture, setPrefecture] = useState<Prefecture | "">("");
  const [region, setRegion] = useState<Region | "">("");
  const [visitedOnly, setVisitedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filterKey = `${query}|${prefecture}|${region}|${visitedOnly}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const prefectureCounts = useMemo(
    () => countByPrefecture(roadsideStations),
    [],
  );

  const visitedStationIds = useMemo(() => new Set(getVisitedStationIds()), []);

  const filteredStations = useMemo(() => {
    const byFilter = filterStations(roadsideStations, {
      query,
      prefecture: prefecture || undefined,
      region: region || undefined,
    });
    return filterByVisited(byFilter, visitedStationIds, visitedOnly);
  }, [query, prefecture, region, visitedOnly, visitedStationIds]);

  const totalPages = getTotalPages(filteredStations.length, PAGE_SIZE);
  const visibleStations = paginate(filteredStations, page, PAGE_SIZE);

  return (
    <>
      <h1>道の駅一覧</h1>
      <PrefectureSummary counts={prefectureCounts} />
      <SearchFilter
        query={query}
        prefecture={prefecture}
        region={region}
        onQueryChange={setQuery}
        onPrefectureChange={setPrefecture}
        onRegionChange={setRegion}
      />
      <label className="visited-only-filter">
        <input
          type="checkbox"
          checked={visitedOnly}
          onChange={(event) => setVisitedOnly(event.target.checked)}
        />
        行った道の駅だけ表示
      </label>
      <StationList
        stations={visibleStations}
        totalCount={filteredStations.length}
        visitedStationIds={visitedStationIds}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

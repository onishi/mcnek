import { useMemo, useState } from "react";
import { roadsideStations } from "../data/stations";
import { StationList } from "../components/StationList";
import { SearchFilter } from "../components/SearchFilter";
import { PrefectureSummary } from "../components/PrefectureSummary";
import { Pagination } from "../components/Pagination";
import { filterStations } from "../lib/filterStations";
import { countByPrefecture } from "../lib/countByPrefecture";
import { getTotalPages, paginate } from "../lib/paginate";
import type { Prefecture, Region } from "../types/roadsideStation";

const PAGE_SIZE = 30;

export function StationListPage() {
  const [query, setQuery] = useState("");
  const [prefecture, setPrefecture] = useState<Prefecture | "">("");
  const [region, setRegion] = useState<Region | "">("");
  const [page, setPage] = useState(1);

  const filterKey = `${query}|${prefecture}|${region}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const prefectureCounts = useMemo(
    () => countByPrefecture(roadsideStations),
    [],
  );

  const filteredStations = useMemo(
    () =>
      filterStations(roadsideStations, {
        query,
        prefecture: prefecture || undefined,
        region: region || undefined,
      }),
    [query, prefecture, region],
  );

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
      <StationList
        stations={visibleStations}
        totalCount={filteredStations.length}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { roadsideStations } from "../data/stations";
import { StationList } from "../components/StationList";
import { SearchFilter } from "../components/SearchFilter";
import { PrefectureSummary } from "../components/PrefectureSummary";
import { RegionSummary } from "../components/RegionSummary";
import { Pagination } from "../components/Pagination";
import { filterStations } from "../lib/filterStations";
import { countByPrefecture } from "../lib/countByPrefecture";
import { countByRegion } from "../lib/countByRegion";
import { getTotalPages, paginate } from "../lib/paginate";
import { filterByVisited, getVisitedStationIds } from "../lib/visitStorage";
import type { Prefecture, Region } from "../types/roadsideStation";
import "./StationListPage.css";

const PAGE_SIZE = 30;

export function StationListPage() {
  const [query, setQuery] = useState("");
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [visitedOnly, setVisitedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const filterKey = `${query}|${prefectures.join(",")}|${regions.join(",")}|${visitedOnly}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const prefectureCounts = useMemo(
    () => countByPrefecture(roadsideStations),
    [],
  );

  const regionCounts = useMemo(
    () => countByRegion(roadsideStations),
    [],
  );

  const visitedStationIds = useMemo(() => new Set(getVisitedStationIds()), []);

  const filteredStations = useMemo(() => {
    const byFilter = filterStations(roadsideStations, {
      query,
      prefectures: prefectures.length ? prefectures : undefined,
      regions: regions.length ? regions : undefined,
    });
    return filterByVisited(byFilter, visitedStationIds, visitedOnly);
  }, [query, prefectures, regions, visitedOnly, visitedStationIds]);

  const totalPages = getTotalPages(filteredStations.length, PAGE_SIZE);
  const visibleStations = paginate(filteredStations, page, PAGE_SIZE);

  return (
    <>
      <h1>道の駅一覧</h1>
      <Link to="/visited" className="visited-stations-link">
        行った道の駅を見る
      </Link>
      <RegionSummary
        counts={regionCounts}
        selected={regions}
        onSelect={(r) => {
          setRegions((prev) =>
            prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
          );
          setPrefectures([]);
        }}
      />
      <PrefectureSummary
        counts={prefectureCounts}
        selected={prefectures}
        onSelect={(p) =>
          setPrefectures((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
          )
        }
        filterRegions={regions}
      />
      <SearchFilter query={query} onQueryChange={setQuery} />
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

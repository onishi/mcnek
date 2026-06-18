import { useMemo, useState } from "react";
import { sampleStations } from "../data/sampleStations";
import { StationList } from "../components/StationList";
import { SearchFilter } from "../components/SearchFilter";
import { filterStations } from "../lib/filterStations";
import type { Prefecture, Region } from "../types/roadsideStation";

export function StationListPage() {
  const [query, setQuery] = useState("");
  const [prefecture, setPrefecture] = useState<Prefecture | "">("");
  const [region, setRegion] = useState<Region | "">("");

  const filteredStations = useMemo(
    () =>
      filterStations(sampleStations, {
        query,
        prefecture: prefecture || undefined,
        region: region || undefined,
      }),
    [query, prefecture, region],
  );

  return (
    <>
      <h1>道の駅一覧</h1>
      <SearchFilter
        query={query}
        prefecture={prefecture}
        region={region}
        onQueryChange={setQuery}
        onPrefectureChange={setPrefecture}
        onRegionChange={setRegion}
      />
      <StationList stations={filteredStations} />
    </>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { roadsideStations } from "../data/stations";
import { StationList } from "../components/StationList";
import { VisitedSummary } from "../components/VisitedSummary";
import { VisitedPrefectureSummary } from "../components/VisitedPrefectureSummary";
import { countByPrefecture } from "../lib/countByPrefecture";
import {
  countVisitedByPrefecture,
  getOverallVisitStats,
} from "../lib/visitStats";
import { filterByVisited, getVisitedStationIds } from "../lib/visitStorage";
import "./VisitedStationsPage.css";

export function VisitedStationsPage() {
  const visitedStationIds = useMemo(() => new Set(getVisitedStationIds()), []);

  const prefectureCounts = useMemo(
    () => countByPrefecture(roadsideStations),
    [],
  );
  const visitedPrefectureCounts = useMemo(
    () => countVisitedByPrefecture(roadsideStations, visitedStationIds),
    [visitedStationIds],
  );
  const overallStats = useMemo(
    () => getOverallVisitStats(roadsideStations, visitedStationIds),
    [visitedStationIds],
  );
  const visitedStations = useMemo(
    () => filterByVisited(roadsideStations, visitedStationIds, true),
    [visitedStationIds],
  );

  return (
    <>
      <h1>行った道の駅</h1>
      <VisitedSummary
        totalCount={overallStats.totalCount}
        visitedCount={overallStats.visitedCount}
        achievementRate={overallStats.achievementRate}
      />
      <VisitedPrefectureSummary
        counts={prefectureCounts}
        visitedCounts={visitedPrefectureCounts}
      />
      <StationList
        stations={visitedStations}
        visitedStationIds={visitedStationIds}
      />
      <Link to="/" className="visited-stations-page-back-link">
        一覧に戻る
      </Link>
    </>
  );
}

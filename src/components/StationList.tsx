import { Link } from "react-router-dom";
import type { RoadsideStation } from "../types/roadsideStation";
import "./StationList.css";

type Props = {
  stations: RoadsideStation[];
  totalCount?: number;
  visitedStationIds?: ReadonlySet<string>;
};

export function StationList({
  stations,
  totalCount,
  visitedStationIds = new Set(),
}: Props) {
  return (
    <section>
      <p className="station-count">{totalCount ?? stations.length} 件</p>
      {stations.length === 0 ? (
        <p className="station-empty">該当する道の駅が見つかりません</p>
      ) : (
        <ul className="station-list">
          {stations.map((station) => (
            <li key={station.id} className="station-item">
              <Link to={`/stations/${station.id}`} className="station-link">
                <span className="station-name">{station.name}</span>
                <span className="station-prefecture">{station.prefecture}</span>
                <span className="station-address">{station.address}</span>
                {visitedStationIds.has(station.id) && (
                  <span className="station-visited-badge">行った済み</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

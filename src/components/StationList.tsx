import type { RoadsideStation } from "../types/roadsideStation";
import "./StationList.css";

type Props = {
  stations: RoadsideStation[];
};

export function StationList({ stations }: Props) {
  return (
    <section>
      <p className="station-count">{stations.length} 件</p>
      {stations.length === 0 ? (
        <p className="station-empty">該当する道の駅が見つかりません</p>
      ) : (
        <ul className="station-list">
          {stations.map((station) => (
            <li key={station.id} className="station-item">
              <span className="station-name">{station.name}</span>
              <span className="station-prefecture">{station.prefecture}</span>
              <span className="station-address">{station.address}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

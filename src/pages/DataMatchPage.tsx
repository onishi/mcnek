import { useMemo } from "react";
import { Link } from "react-router-dom";
import { roadsideStations } from "../data/stations";
import {
  computeAssociationMatchByPrefecture,
  findUnmatchedStations,
} from "../lib/associationMatch";
import "./DataMatchPage.css";

export function DataMatchPage() {
  const prefectureStats = useMemo(
    () => computeAssociationMatchByPrefecture(roadsideStations),
    [],
  );
  const unmatchedStations = useMemo(
    () => findUnmatchedStations(roadsideStations),
    [],
  );

  const totalMatched = prefectureStats.reduce(
    (sum, stat) => sum + stat.matched,
    0,
  );
  const totalCount = prefectureStats.reduce(
    (sum, stat) => sum + stat.total,
    0,
  );

  return (
    <section className="data-match">
      <h1>データ照合</h1>
      <p className="data-match-summary">
        国土交通省データ {totalCount} 件中、全国「道の駅」連絡会データと
        {totalMatched} 件が一致（未一致 {totalCount - totalMatched} 件）
      </p>

      <h2>都道府県別の一致率</h2>
      <table className="data-match-table">
        <thead>
          <tr>
            <th>都道府県</th>
            <th>一致</th>
            <th>全件</th>
            <th>一致率</th>
          </tr>
        </thead>
        <tbody>
          {prefectureStats.map((stat) => (
            <tr key={stat.prefecture}>
              <td>{stat.prefecture}</td>
              <td>{stat.matched}</td>
              <td>{stat.total}</td>
              <td>
                {stat.total === 0
                  ? "-"
                  : `${Math.round((stat.matched / stat.total) * 100)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>未一致の駅 ({unmatchedStations.length} 件)</h2>
      {unmatchedStations.length === 0 ? (
        <p>未一致の駅はありません</p>
      ) : (
        <ul className="data-match-unmatched-list">
          {unmatchedStations.map((station) => (
            <li key={station.id}>
              <Link to={`/stations/${station.id}`}>
                {station.prefecture} {station.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/">一覧に戻る</Link>
    </section>
  );
}

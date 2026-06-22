import { useMemo } from "react";
import { Link } from "react-router-dom";
import { roadsideStations } from "../data/stations";
import { michiNoEkiStations } from "../data/michiNoEkiStations";
import { groupStationsByPrefecture } from "../lib/associationMatch";
import { buildMichiNoEkiUrl } from "../lib/michiNoEkiUrl";
import "./DataMatchPage.css";

export function DataMatchPage() {
  const prefectureGroups = useMemo(
    () => groupStationsByPrefecture(roadsideStations, michiNoEkiStations),
    [],
  );

  const totalCount = roadsideStations.length;
  const totalMatched = roadsideStations.filter(
    (station) => station.associationSourceUrl !== null,
  ).length;

  return (
    <section className="data-match">
      <h1>データ照合</h1>
      <p className="data-match-summary">
        国土交通省データ {totalCount} 件中、全国「道の駅」連絡会データと
        {totalMatched} 件が一致（未一致 {totalCount - totalMatched} 件）
      </p>

      {prefectureGroups
        .filter((group) => group.rows.length > 0)
        .map((group) => {
          const matchedCount = group.rows.filter(
            (row) => row.mlitStation && row.michiNoEkiRecord,
          ).length;

          return (
            <section key={group.prefecture} className="data-match-prefecture">
              <h2>
                {group.prefecture} ({matchedCount}/{group.rows.length} 一致)
              </h2>
              <table className="data-match-table">
                <thead>
                  <tr>
                    <th>国土交通省データ</th>
                    <th>連絡会データ</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr
                      key={
                        row.mlitStation?.id ??
                        row.michiNoEkiRecord?.stationPath
                      }
                      className={
                        row.mlitStation && row.michiNoEkiRecord
                          ? undefined
                          : "data-match-overflow-row"
                      }
                    >
                      <td>
                        {row.mlitStation ? (
                          <Link to={`/stations/${row.mlitStation.id}`}>
                            {row.mlitStation.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {row.michiNoEkiRecord ? (
                          <a
                            href={buildMichiNoEkiUrl(
                              row.michiNoEkiRecord.stationPath,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row.michiNoEkiRecord.name}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}

      <Link to="/">一覧に戻る</Link>
    </section>
  );
}

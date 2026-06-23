import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { roadsideStations } from "../data/stations";
import { michiNoEkiStations } from "../data/michiNoEkiStations";
import { groupStationsByPrefecture } from "../lib/associationMatch";
import { buildMichiNoEkiUrl } from "../lib/michiNoEkiUrl";
import {
  exportManualLinkDrafts,
  getAllManualLinkDrafts,
  setManualLinkDraft,
  type ManualLinkDraftMap,
} from "../lib/manualLinkDraft";
import { applyManualMichiNoEkiLinks } from "../import/applyManualMichiNoEkiLinks";
import "./DataMatchPage.css";

export function DataMatchPage() {
  const [manualDrafts, setManualDrafts] = useState<ManualLinkDraftMap>(() =>
    getAllManualLinkDrafts(),
  );

  const manualLinks = useMemo(
    () =>
      Object.entries(manualDrafts).map(([mlitStationId, stationPaths]) => ({
        mlitStationId,
        stationPaths,
      })),
    [manualDrafts],
  );

  const effectiveStations = useMemo(
    () => applyManualMichiNoEkiLinks(roadsideStations, manualLinks),
    [manualLinks],
  );

  const prefectureGroups = useMemo(
    () => groupStationsByPrefecture(effectiveStations, michiNoEkiStations),
    [effectiveStations],
  );

  const totalCount = effectiveStations.length;
  const totalMatched = effectiveStations.filter(
    (station) => station.associationSourceUrls.length > 0,
  ).length;

  const handleToggleManualLink = (
    mlitStationId: string,
    stationPath: string,
    checked: boolean,
  ) => {
    const current = manualDrafts[mlitStationId] ?? [];
    const next = checked
      ? [...current, stationPath]
      : current.filter((path) => path !== stationPath);
    setManualLinkDraft(mlitStationId, next);
    setManualDrafts((prev) => {
      const updated = { ...prev };
      if (next.length === 0) {
        delete updated[mlitStationId];
      } else {
        updated[mlitStationId] = next;
      }
      return updated;
    });
  };

  const handleCopyManualLinks = () => {
    const json = JSON.stringify(exportManualLinkDrafts(), null, 2);
    void navigator.clipboard.writeText(json);
  };

  return (
    <section className="data-match">
      <h1>データ照合</h1>
      <p className="data-match-summary">
        国土交通省データ {totalCount} 件中、全国「道の駅」連絡会データと
        {totalMatched} 件が一致（未一致 {totalCount - totalMatched} 件）
      </p>
      <p className="data-match-manual-controls">
        手動紐付け {manualLinks.length} 件（チェックすると下の一覧にすぐ反映されます）
        <button type="button" onClick={handleCopyManualLinks}>
          手動紐付けをJSONでコピー
        </button>
        <span className="data-match-manual-hint">
          コピーした内容を data/manual/michiNoEkiManualLinks.json に保存し、
          npm run import:michinoeki:merge を実行してください
        </span>
      </p>

      {prefectureGroups
        .filter((group) => group.rows.length > 0)
        .map((group) => {
          const matchedCount = group.rows.filter(
            (row) => row.mlitStation && row.michiNoEkiRecords.length > 0,
          ).length;
          const unmatchedEkiRows = group.rows.filter(
            (row) => !row.mlitStation,
          );

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
                  {group.rows.map((row) => {
                    const isMatched =
                      row.mlitStation && row.michiNoEkiRecords.length > 0;

                    return (
                      <tr
                        key={
                          row.mlitStation?.id ??
                          row.michiNoEkiRecords[0]?.stationPath
                        }
                        className={
                          isMatched ? undefined : "data-match-overflow-row"
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
                          {row.michiNoEkiRecords.length > 0 && (
                            <ul className="data-match-eki-list">
                              {row.michiNoEkiRecords.map((record) => (
                                <li key={record.stationPath}>
                                  <a
                                    href={buildMichiNoEkiUrl(
                                      record.stationPath,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {record.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                          {row.mlitStation && unmatchedEkiRows.length > 0 && (
                            <fieldset className="data-match-manual-picker">
                              <legend>連絡会データを手動で選ぶ</legend>
                              {unmatchedEkiRows.map((candidateRow) => {
                                const record = candidateRow.michiNoEkiRecords[0];
                                if (!record || !row.mlitStation) return null;
                                const checked = (
                                  manualDrafts[row.mlitStation.id] ?? []
                                ).includes(record.stationPath);

                                return (
                                  <label key={record.stationPath}>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={(event) => {
                                        if (!row.mlitStation) return;
                                        handleToggleManualLink(
                                          row.mlitStation.id,
                                          record.stationPath,
                                          event.target.checked,
                                        );
                                      }}
                                    />
                                    {record.name}
                                  </label>
                                );
                              })}
                            </fieldset>
                          )}
                          {row.michiNoEkiRecords.length === 0 &&
                            !(row.mlitStation && unmatchedEkiRows.length > 0) &&
                            "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}

      <Link to="/">一覧に戻る</Link>
    </section>
  );
}

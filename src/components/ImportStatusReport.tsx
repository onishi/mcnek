import type { ImportMeta } from "../lib/importMeta";
import type { MlitStationsDiff } from "../import/diffMlitStations";
import "./ImportStatusReport.css";

type Props = {
  importMeta: ImportMeta;
  diff: MlitStationsDiff;
};

function formatFetchedAt(fetchedAt: string | undefined): string {
  if (!fetchedAt) return "未取得";
  return new Date(fetchedAt).toLocaleString("ja-JP");
}

export function ImportStatusReport({ importMeta, diff }: Props) {
  const hasDiff =
    diff.added.length > 0 ||
    diff.removed.length > 0 ||
    diff.renamed.length > 0 ||
    diff.addressChanged.length > 0;

  return (
    <section className="import-status-report">
      <h2>データ取得状況</h2>
      <ul className="import-status-sources">
        <li>
          国土交通省データ: {formatFetchedAt(importMeta.mlit?.fetchedAt)}（
          {importMeta.mlit?.count ?? 0} 件）
        </li>
        <li>
          連絡会データ: {formatFetchedAt(importMeta.michinoeki?.fetchedAt)}（
          {importMeta.michinoeki?.count ?? 0} 件）
        </li>
      </ul>

      <h3>前回データとの差分（国土交通省データ）</h3>
      {!hasDiff ? (
        <p>前回の取り込みから差分はありません</p>
      ) : (
        <dl className="import-status-diff">
          <dt>新規登録（{diff.added.length} 件）</dt>
          <dd>
            {diff.added.length === 0 ? (
              "なし"
            ) : (
              <ul>
                {diff.added.map((station) => (
                  <li key={station.id}>
                    {station.prefecture} {station.name}
                  </li>
                ))}
              </ul>
            )}
          </dd>

          <dt>廃止（{diff.removed.length} 件）</dt>
          <dd>
            {diff.removed.length === 0 ? (
              "なし"
            ) : (
              <ul>
                {diff.removed.map((station) => (
                  <li key={station.id}>
                    {station.prefecture} {station.name}
                  </li>
                ))}
              </ul>
            )}
          </dd>

          <dt>名称変更（{diff.renamed.length} 件）</dt>
          <dd>
            {diff.renamed.length === 0 ? (
              "なし"
            ) : (
              <ul>
                {diff.renamed.map((station) => (
                  <li key={station.id}>
                    {station.prefecture} {station.previousName} →{" "}
                    {station.currentName}
                  </li>
                ))}
              </ul>
            )}
          </dd>

          <dt>所在地変更（{diff.addressChanged.length} 件）</dt>
          <dd>
            {diff.addressChanged.length === 0 ? (
              "なし"
            ) : (
              <ul>
                {diff.addressChanged.map((station) => (
                  <li key={station.id}>
                    {station.name}: {station.previousAddress} →{" "}
                    {station.currentAddress}
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </dl>
      )}
    </section>
  );
}

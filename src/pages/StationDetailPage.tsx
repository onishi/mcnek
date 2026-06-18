import { Link, useParams } from "react-router-dom";
import { sampleStations } from "../data/sampleStations";
import "./StationDetailPage.css";

export function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const station = sampleStations.find((s) => s.id === id);

  if (!station) {
    return (
      <section className="station-detail">
        <p className="station-detail-not-found">
          指定された道の駅が見つかりません
        </p>
        <Link to="/">一覧に戻る</Link>
      </section>
    );
  }

  return (
    <section className="station-detail">
      <h1>{station.name}</h1>
      <dl className="station-detail-info">
        <dt>所在地</dt>
        <dd>{station.address}</dd>
        <dt>登録年月</dt>
        <dd>{station.registrationDate ?? "不明"}</dd>
      </dl>
      <Link to="/">一覧に戻る</Link>
    </section>
  );
}

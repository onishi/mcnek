import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { roadsideStations } from "../data/stations";
import { hasCoordinates } from "../lib/coordinates";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";

// Leaflet のデフォルトアイコンはバンドラー環境で壊れるため差し替える
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function MapPage() {
  const navigate = useNavigate();

  const stationsWithCoords = useMemo(
    () => roadsideStations.filter(hasCoordinates),
    [],
  );

  return (
    <div className="map-page">
      <div className="map-page-header">
        <h1>地図で探す</h1>
        <span className="map-page-count">
          {stationsWithCoords.length > 0
            ? `${stationsWithCoords.length} 件の道の駅を表示中`
            : "座標データを準備中です"}
        </span>
        <Link to="/" className="map-page-back">
          一覧に戻る
        </Link>
      </div>
      <MapContainer
        center={[36.5, 137.0]}
        zoom={5}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stationsWithCoords.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude!, station.longitude!]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => navigate(`/stations/${station.id}`),
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {station.address}
              <br />
              <button
                className="map-popup-link"
                onClick={() => navigate(`/stations/${station.id}`)}
              >
                詳細を見る
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

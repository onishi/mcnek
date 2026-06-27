import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { StationListPage } from "./pages/StationListPage";
import { StationDetailPage } from "./pages/StationDetailPage";
import { VisitedStationsPage } from "./pages/VisitedStationsPage";
import { MapPage } from "./pages/MapPage";
import { PwaStatusBanner } from "./components/PwaStatusBanner";
import "./App.css";

// 連絡会データ（michiNoEkiStations.json）を含む管理用ページのため、
// 一般利用者が読み込む主要バンドルから分離する
const DataMatchPage = lazy(() =>
  import("./pages/DataMatchPage").then((module) => ({
    default: module.DataMatchPage,
  })),
);

function App() {
  return (
    <main className="app">
      <PwaStatusBanner />
      <Routes>
        <Route path="/" element={<StationListPage />} />
        <Route path="/stations/:id" element={<StationDetailPage />} />
        <Route path="/visited" element={<VisitedStationsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route
          path="/data-check"
          element={
            <Suspense fallback={<p>読み込み中...</p>}>
              <DataMatchPage />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;

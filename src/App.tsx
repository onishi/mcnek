import { Route, Routes } from "react-router-dom";
import { StationListPage } from "./pages/StationListPage";
import { StationDetailPage } from "./pages/StationDetailPage";
import { VisitedStationsPage } from "./pages/VisitedStationsPage";
import { DataMatchPage } from "./pages/DataMatchPage";
import { PwaStatusBanner } from "./components/PwaStatusBanner";
import "./App.css";

function App() {
  return (
    <main className="app">
      <PwaStatusBanner />
      <Routes>
        <Route path="/" element={<StationListPage />} />
        <Route path="/stations/:id" element={<StationDetailPage />} />
        <Route path="/visited" element={<VisitedStationsPage />} />
        <Route path="/data-check" element={<DataMatchPage />} />
      </Routes>
    </main>
  );
}

export default App;

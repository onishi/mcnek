import { Route, Routes } from "react-router-dom";
import { StationListPage } from "./pages/StationListPage";
import { StationDetailPage } from "./pages/StationDetailPage";
import { DataMatchPage } from "./pages/DataMatchPage";
import "./App.css";

function App() {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<StationListPage />} />
        <Route path="/stations/:id" element={<StationDetailPage />} />
        <Route path="/data-check" element={<DataMatchPage />} />
      </Routes>
    </main>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import { StationListPage } from "./pages/StationListPage";
import { StationDetailPage } from "./pages/StationDetailPage";
import "./App.css";

function App() {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<StationListPage />} />
        <Route path="/stations/:id" element={<StationDetailPage />} />
      </Routes>
    </main>
  );
}

export default App;

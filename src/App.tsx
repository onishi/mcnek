import { sampleStations } from "./data/sampleStations";
import { StationList } from "./components/StationList";
import "./App.css";

function App() {
  return (
    <main className="app">
      <h1>道の駅一覧</h1>
      <StationList stations={sampleStations} />
    </main>
  );
}

export default App;

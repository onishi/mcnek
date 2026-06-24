import generatedDiff from "./generated/mlitStationsDiff.json";
import type { MlitStationsDiff } from "../import/diffMlitStations";

export const mlitStationsDiff: MlitStationsDiff =
  generatedDiff as MlitStationsDiff;

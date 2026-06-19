import generatedStations from "./generated/mlitStations.json";
import type { RoadsideStation } from "../types/roadsideStation";

export const roadsideStations: RoadsideStation[] =
  generatedStations as RoadsideStation[];

import generatedRecords from "./generated/michiNoEkiStations.json";
import type { MichiNoEkiRecord } from "../import/parseMichiNoEkiPage";

export const michiNoEkiStations: MichiNoEkiRecord[] =
  generatedRecords as MichiNoEkiRecord[];

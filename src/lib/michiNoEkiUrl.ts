export const MICHI_NO_EKI_BASE_URL = "https://www.michi-no-eki.jp";

export function buildMichiNoEkiUrl(stationPath: string): string {
  return `${MICHI_NO_EKI_BASE_URL}${stationPath}`;
}

export function extractMichiNoEkiPath(associationSourceUrl: string): string {
  return associationSourceUrl.slice(MICHI_NO_EKI_BASE_URL.length);
}

import { JSDOM } from "jsdom";

export type MichiNoEkiRecord = {
  name: string;
  prefecture: string;
  municipality: string;
  stationPath: string;
};

export function parseMichiNoEkiPage(html: string): MichiNoEkiRecord[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'a[href^="/stations/views/"]',
  );

  const records: MichiNoEkiRecord[] = [];
  for (const link of links) {
    const h3 = link.querySelector("h3");
    const locationEl = link.querySelector(".txt");
    if (!h3 || !locationEl) continue;

    const name = h3.textContent?.trim() ?? "";
    const locationText = locationEl.textContent?.trim() ?? "";
    const stationPath = link.getAttribute("href") ?? "";

    if (!name || !stationPath || !locationText) continue;

    // "都道府県 市区町村" 形式を分割
    const spaceIndex = locationText.indexOf(" ");
    const prefecture =
      spaceIndex >= 0 ? locationText.slice(0, spaceIndex) : locationText;
    const municipality =
      spaceIndex >= 0 ? locationText.slice(spaceIndex + 1) : "";

    records.push({ name, prefecture, municipality, stationPath });
  }

  return records;
}

import type { RoadsideStation } from "../types/roadsideStation";

const MLIT_LIST_URL = "https://www.mlit.go.jp/road/Michi-no-Eki/list.html";

export const sampleStations: RoadsideStation[] = [
  {
    id: "gunma-kawaba-denen-plaza",
    name: "川場田園プラザ",
    prefecture: "群馬県",
    municipality: "川場村",
    address: "群馬県利根郡川場村萩室385",
    registrationRound: 1,
    registrationDate: "1993-04",
    latitude: 36.6939,
    longitude: 139.1486,
    mlitSourceUrl: MLIT_LIST_URL,
    associationSourceUrls: [],
    updatedAt: "2026-06-16T00:00:00.000Z",
  },
  {
    id: "hokkaido-toyoura",
    name: "とようら",
    prefecture: "北海道",
    municipality: "豊浦町",
    address: "北海道虻田郡豊浦町字礫岩133-2",
    registrationRound: 6,
    registrationDate: "1996-08",
    latitude: 42.6447,
    longitude: 140.4097,
    mlitSourceUrl: MLIT_LIST_URL,
    associationSourceUrls: [],
    updatedAt: "2026-06-16T00:00:00.000Z",
  },
  {
    id: "iwate-tono-kazenooka",
    name: "遠野風の丘",
    prefecture: "岩手県",
    municipality: "遠野市",
    address: "岩手県遠野市風呼43-1",
    registrationRound: 14,
    registrationDate: "1998-04",
    latitude: 39.3486,
    longitude: 141.5719,
    mlitSourceUrl: MLIT_LIST_URL,
    associationSourceUrls: [],
    updatedAt: "2026-06-16T00:00:00.000Z",
  },
];

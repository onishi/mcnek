export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

export type Prefecture = (typeof PREFECTURES)[number];

export const REGIONS = [
  "北海道地方",
  "東北地方",
  "関東地方",
  "中部地方",
  "近畿地方",
  "中国地方",
  "四国地方",
  "九州・沖縄地方",
] as const;

export type Region = (typeof REGIONS)[number];

/**
 * 道の駅の登録情報。
 * 地方（Region）はフィールドとして持たず、prefecture から導出する（src/data/regions.ts）。
 * registrationDate は "YYYY-MM" 形式の文字列、または未登録時 null。
 */
export type RoadsideStation = {
  id: string;
  name: string;
  prefecture: Prefecture;
  municipality: string;
  address: string;
  registrationRound: number | null;
  registrationDate: string | null;
  latitude: number | null;
  longitude: number | null;
  mlitSourceUrl: string;
  associationSourceUrl: string | null;
  updatedAt: string;
};

export type VisitRecord = {
  stationId: string;
  visitedAt: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

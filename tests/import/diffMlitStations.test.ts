import { diffMlitStations } from "../../src/import/diffMlitStations";
import type { RoadsideStation } from "../../src/types/roadsideStation";

function buildStation(overrides: Partial<RoadsideStation> = {}): RoadsideStation {
  return {
    id: "base-id",
    name: "川場田園プラザ",
    prefecture: "群馬県",
    municipality: "利根郡川場村",
    address: "群馬県利根郡川場村",
    registrationRound: 1,
    registrationDate: "1993-04",
    latitude: null,
    longitude: null,
    mlitSourceUrl: "https://example.com",
    associationSourceUrls: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("変更がない場合は全カテゴリ空になる", () => {
  const station = buildStation();
  const diff = diffMlitStations([station], [station]);

  expect(diff).toEqual({
    added: [],
    removed: [],
    renamed: [],
    addressChanged: [],
  });
});

test("前回になかった駅は新規登録として検出する", () => {
  const previous = [buildStation()];
  const newStation = buildStation({
    id: "new-id",
    name: "別の道の駅",
    municipality: "別の市",
    registrationRound: 99,
  });

  const diff = diffMlitStations(previous, [...previous, newStation]);

  expect(diff.added).toEqual([
    {
      id: "new-id",
      name: "別の道の駅",
      prefecture: "群馬県",
      municipality: "別の市",
    },
  ]);
});

test("今回データにない駅は廃止として検出する", () => {
  const removedStation = buildStation({
    id: "removed-id",
    name: "廃止された駅",
    registrationRound: 99,
  });

  const diff = diffMlitStations([removedStation], []);

  expect(diff.removed).toEqual([
    {
      id: "removed-id",
      name: "廃止された駅",
      prefecture: "群馬県",
      municipality: "利根郡川場村",
    },
  ]);
});

test("同じ都道府県・市区町村・登録回で名前が変わった場合は名称変更として検出する", () => {
  const previousStation = buildStation({ id: "old-id", name: "旧名称" });
  const currentStation = buildStation({ id: "new-id", name: "新名称" });

  const diff = diffMlitStations([previousStation], [currentStation]);

  expect(diff.renamed).toEqual([
    {
      id: "new-id",
      previousName: "旧名称",
      currentName: "新名称",
      prefecture: "群馬県",
      municipality: "利根郡川場村",
    },
  ]);
  expect(diff.added).toEqual([]);
  expect(diff.removed).toEqual([]);
});

test("名前が同じで所在地が変わった場合は所在地変更として検出する", () => {
  const previousStation = buildStation({ address: "群馬県利根郡川場村1番地" });
  const currentStation = buildStation({ address: "群馬県利根郡川場村2番地" });

  const diff = diffMlitStations([previousStation], [currentStation]);

  expect(diff.addressChanged).toEqual([
    {
      id: "base-id",
      name: "川場田園プラザ",
      previousAddress: "群馬県利根郡川場村1番地",
      currentAddress: "群馬県利根郡川場村2番地",
    },
  ]);
});

test("登録回・市区町村が重複する場合でも名前が一致する組から優先して突き合わせる", () => {
  const previousA = buildStation({ id: "a", name: "A駅" });
  const previousB = buildStation({ id: "b", name: "B駅" });
  const currentA = buildStation({ id: "a2", name: "A駅" });
  const currentB = buildStation({ id: "b2", name: "B駅改名" });

  const diff = diffMlitStations(
    [previousA, previousB],
    [currentA, currentB],
  );

  // A駅は名前一致で突き合わされ変更なし、B駅は残りのB駅(旧)と突き合わされ名称変更
  expect(diff.renamed).toEqual([
    {
      id: "b2",
      previousName: "B駅",
      currentName: "B駅改名",
      prefecture: "群馬県",
      municipality: "利根郡川場村",
    },
  ]);
  expect(diff.added).toEqual([]);
  expect(diff.removed).toEqual([]);
});

import { render, screen } from "@testing-library/react";
import { ImportStatusReport } from "../../src/components/ImportStatusReport";
import type { ImportMeta } from "../../src/lib/importMeta";
import type { MlitStationsDiff } from "../../src/import/diffMlitStations";

const emptyDiff: MlitStationsDiff = {
  added: [],
  removed: [],
  renamed: [],
  addressChanged: [],
};

const meta: ImportMeta = {
  mlit: { fetchedAt: "2026-01-01T00:00:00.000Z", count: 1231 },
  michinoeki: { fetchedAt: "2026-01-02T00:00:00.000Z", count: 1234 },
};

test("取得件数を表示する", () => {
  render(<ImportStatusReport importMeta={meta} diff={emptyDiff} />);
  expect(screen.getByText(/1231 件/)).toBeInTheDocument();
  expect(screen.getByText(/1234 件/)).toBeInTheDocument();
});

test("取得日時が未登録の場合は「未取得」と表示する", () => {
  render(
    <ImportStatusReport
      importMeta={{ mlit: null, michinoeki: null }}
      diff={emptyDiff}
    />,
  );
  expect(screen.getAllByText(/未取得/)).toHaveLength(2);
});

test("差分がない場合はその旨を表示する", () => {
  render(<ImportStatusReport importMeta={meta} diff={emptyDiff} />);
  expect(
    screen.getByText("前回の取り込みから差分はありません"),
  ).toBeInTheDocument();
});

test("新規登録・廃止・名称変更・所在地変更をそれぞれ表示する", () => {
  const diff: MlitStationsDiff = {
    added: [
      { id: "a", name: "新駅", prefecture: "群馬県", municipality: "前橋市" },
    ],
    removed: [
      { id: "b", name: "廃止駅", prefecture: "群馬県", municipality: "高崎市" },
    ],
    renamed: [
      {
        id: "c",
        previousName: "旧名称",
        currentName: "新名称",
        prefecture: "群馬県",
        municipality: "桐生市",
      },
    ],
    addressChanged: [
      {
        id: "d",
        name: "移転駅",
        previousAddress: "群馬県A町",
        currentAddress: "群馬県B町",
      },
    ],
  };

  render(<ImportStatusReport importMeta={meta} diff={diff} />);

  expect(screen.getByText("群馬県 新駅")).toBeInTheDocument();
  expect(screen.getByText("群馬県 廃止駅")).toBeInTheDocument();
  expect(screen.getByText("群馬県 旧名称 → 新名称")).toBeInTheDocument();
  expect(screen.getByText("移転駅: 群馬県A町 → 群馬県B町")).toBeInTheDocument();
});

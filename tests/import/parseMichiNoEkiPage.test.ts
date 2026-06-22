import { parseMichiNoEkiPage } from "../../src/import/parseMichiNoEkiPage";

function buildHtml(items: { href: string; name: string; location: string }[]): string {
  const lis = items
    .map(
      (item) => `
        <li>
          <a href="${item.href}">
            <figure><img src="/img.jpg" alt=""></figure>
            <h3>${item.name}</h3>
            <div class="txt">${item.location}</div>
          </a>
        </li>`,
    )
    .join("");
  return `<html><body><ul class="searchList">${lis}</ul></body></html>`;
}

test("駅名・都道府県・市区町村・パスを読み取る", () => {
  const html = buildHtml([
    { href: "/stations/views/18786", name: "三笠", location: "北海道 三笠市" },
  ]);

  expect(parseMichiNoEkiPage(html)).toEqual([
    {
      name: "三笠",
      prefecture: "北海道",
      municipality: "三笠市",
      stationPath: "/stations/views/18786",
    },
  ]);
});

test("複数件を読み取り件数が一致する", () => {
  const html = buildHtml([
    { href: "/stations/views/18786", name: "三笠", location: "北海道 三笠市" },
    { href: "/stations/views/18787", name: "芦別", location: "北海道 芦別市" },
    { href: "/stations/views/18788", name: "南ふらの", location: "北海道 南富良野町" },
  ]);

  expect(parseMichiNoEkiPage(html)).toHaveLength(3);
});

test("市区町村が空（都道府県のみ）の場合は空文字になる", () => {
  const html = buildHtml([
    { href: "/stations/views/1", name: "テスト駅", location: "東京都" },
  ]);

  expect(parseMichiNoEkiPage(html)[0]).toEqual({
    name: "テスト駅",
    prefecture: "東京都",
    municipality: "",
    stationPath: "/stations/views/1",
  });
});

test("関連リンク以外のaタグは無視する", () => {
  const html = `<html><body>
    <a href="/other/path"><h3>無関係</h3><div class="txt">無関係 無関係市</div></a>
    ${buildHtml([{ href: "/stations/views/18786", name: "三笠", location: "北海道 三笠市" }]).replace(/<\/?html>|<\/?body>/g, "")}
  </body></html>`;

  expect(parseMichiNoEkiPage(html)).toHaveLength(1);
});

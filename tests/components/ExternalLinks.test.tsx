import { render, screen } from "@testing-library/react";
import { ExternalLinks } from "../../src/components/ExternalLinks";

test("国土交通省のリンクを表示する", () => {
  render(
    <ExternalLinks
      mlitSourceUrl="https://www.mlit.go.jp/road/Michi-no-Eki/list.html"
      associationSourceUrl={null}
    />,
  );
  expect(
    screen.getByRole("link", { name: "国土交通省の一覧を見る" }),
  ).toHaveAttribute(
    "href",
    "https://www.mlit.go.jp/road/Michi-no-Eki/list.html",
  );
});

test("連絡会の詳細URLがある場合はリンクを表示する", () => {
  render(
    <ExternalLinks
      mlitSourceUrl="https://www.mlit.go.jp/road/Michi-no-Eki/list.html"
      associationSourceUrl="https://www.michi-no-eki.jp/stations/1"
    />,
  );
  expect(
    screen.getByRole("link", { name: "全国「道の駅」連絡会の詳細を見る" }),
  ).toHaveAttribute("href", "https://www.michi-no-eki.jp/stations/1");
});

test("連絡会の詳細URLがない場合は未登録メッセージを表示する", () => {
  render(
    <ExternalLinks
      mlitSourceUrl="https://www.mlit.go.jp/road/Michi-no-Eki/list.html"
      associationSourceUrl={null}
    />,
  );
  expect(
    screen.getByText("全国「道の駅」連絡会の詳細は未登録です"),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "全国「道の駅」連絡会の詳細を見る" }),
  ).not.toBeInTheDocument();
});

test("外部リンクは新しいタブで開く", () => {
  render(
    <ExternalLinks
      mlitSourceUrl="https://www.mlit.go.jp/road/Michi-no-Eki/list.html"
      associationSourceUrl="https://www.michi-no-eki.jp/stations/1"
    />,
  );
  for (const link of screen.getAllByRole("link")) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

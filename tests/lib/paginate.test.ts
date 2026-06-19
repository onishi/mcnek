import { getTotalPages, paginate } from "../../src/lib/paginate";

test("件数がページサイズで割り切れる場合の総ページ数", () => {
  expect(getTotalPages(30, 10)).toBe(3);
});

test("件数がページサイズで割り切れない場合は繰り上げる", () => {
  expect(getTotalPages(25, 10)).toBe(3);
});

test("件数が 0 件でも最低 1 ページになる", () => {
  expect(getTotalPages(0, 10)).toBe(1);
});

test("指定したページのアイテムだけを返す", () => {
  const items = [1, 2, 3, 4, 5];
  expect(paginate(items, 1, 2)).toEqual([1, 2]);
  expect(paginate(items, 2, 2)).toEqual([3, 4]);
  expect(paginate(items, 3, 2)).toEqual([5]);
});

test("範囲外のページでは空配列になる", () => {
  expect(paginate([1, 2, 3], 5, 2)).toEqual([]);
});

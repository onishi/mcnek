import { render, screen, fireEvent } from "@testing-library/react";
import { SearchFilter } from "../../src/components/SearchFilter";

function renderWithHandlers() {
  const onQueryChange = jest.fn();
  const onPrefectureChange = jest.fn();
  const onRegionChange = jest.fn();
  render(
    <SearchFilter
      query=""
      prefecture=""
      region=""
      onQueryChange={onQueryChange}
      onPrefectureChange={onPrefectureChange}
      onRegionChange={onRegionChange}
    />,
  );
  return { onQueryChange, onPrefectureChange, onRegionChange };
}

test("駅名検索の入力で onQueryChange が呼ばれる", () => {
  const { onQueryChange } = renderWithHandlers();
  fireEvent.change(screen.getByLabelText("駅名で検索"), {
    target: { value: "風の丘" },
  });
  expect(onQueryChange).toHaveBeenCalledWith("風の丘");
});

test("都道府県の選択で onPrefectureChange が呼ばれる", () => {
  const { onPrefectureChange } = renderWithHandlers();
  fireEvent.change(screen.getByLabelText("都道府県で絞り込み"), {
    target: { value: "北海道" },
  });
  expect(onPrefectureChange).toHaveBeenCalledWith("北海道");
});

test("地方の選択で onRegionChange が呼ばれる", () => {
  const { onRegionChange } = renderWithHandlers();
  fireEvent.change(screen.getByLabelText("地方で絞り込み"), {
    target: { value: "東北地方" },
  });
  expect(onRegionChange).toHaveBeenCalledWith("東北地方");
});

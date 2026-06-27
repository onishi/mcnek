import { render, screen, fireEvent } from "@testing-library/react";
import { SearchFilter } from "../../src/components/SearchFilter";

test("駅名検索の入力で onQueryChange が呼ばれる", () => {
  const onQueryChange = jest.fn();
  render(<SearchFilter query="" onQueryChange={onQueryChange} />);
  fireEvent.change(screen.getByLabelText("駅名で検索"), {
    target: { value: "風の丘" },
  });
  expect(onQueryChange).toHaveBeenCalledWith("風の丘");
});
